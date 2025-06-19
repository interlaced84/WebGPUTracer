import os
from datetime import datetime
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Security, status
from fastapi.security.api_key import APIKeyHeader
from pydantic import BaseModel, Field
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, create_engine, Boolean, event, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.sql import func

load_dotenv()

API_KEY = os.getenv("API_KEY")
API_KEY_NAME = "access_token"
API_KEY_HEADER = APIKeyHeader(name=API_KEY_NAME, auto_error=True)

DATABASE_URL = "sqlite:///./knowledge_base.db"

Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = FastAPI()


# --- Pydantic Models ---
class BaseKnowledgeModel(BaseModel):
    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow)

class BranchUpdateCreate(BaseModel):
    branch_name: str
    summary: str
    author_ai_id: str
    related_files: List[str] = []
    status: str = "in-progress"

class BranchUpdate(BranchUpdateCreate, BaseKnowledgeModel):
    pass

class BugReportCreate(BaseModel):
    description: str
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    steps_to_reproduce: Optional[str] = None
    discovered_by_ai_id: str
    status: str = "new"
    related_branch: Optional[str] = None

class BugReport(BugReportCreate, BaseKnowledgeModel):
    pass

class SolutionKnowledgeCreate(BaseModel):
    problem_description: str
    solution_description: str
    code_snippet: Optional[str] = None
    author_ai_id: str
    verified_working: bool = False
    related_files: List[str] = []
    related_bug_id: Optional[int] = None

class SolutionKnowledge(SolutionKnowledgeCreate, BaseKnowledgeModel):
    pass

class GeneralMessageCreate(BaseModel):
    message_text: str
    author_ai_id: str
    tags: List[str] = []
    thread_id: Optional[str] = None

class GeneralMessage(GeneralMessageCreate, BaseKnowledgeModel):
    pass


# --- SQLAlchemy Models ---
class BranchUpdateDB(Base):
    __tablename__ = "branch_updates"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    branch_name = Column(String, index=True)
    summary = Column(Text)
    author_ai_id = Column(String, index=True)
    related_files = Column(JSON) # Using JSON for list of strings
    status = Column(String, default="in-progress")

class BugReportDB(Base):
    __tablename__ = "bug_reports"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    description = Column(Text)
    file_path = Column(String, nullable=True, index=True)
    line_number = Column(Integer, nullable=True)
    steps_to_reproduce = Column(Text, nullable=True)
    discovered_by_ai_id = Column(String, index=True)
    status = Column(String, default="new")
    related_branch = Column(String, nullable=True)
    solutions = relationship("SolutionKnowledgeDB", back_populates="bug_report")


class SolutionKnowledgeDB(Base):
    __tablename__ = "solution_knowledge"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    problem_description = Column(Text)
    solution_description = Column(Text)
    code_snippet = Column(Text, nullable=True)
    author_ai_id = Column(String, index=True)
    verified_working = Column(Boolean, default=False)
    related_files = Column(JSON) # Using JSON for list of strings
    related_bug_id = Column(Integer, ForeignKey("bug_reports.id"), nullable=True)
    bug_report = relationship("BugReportDB", back_populates="solutions")


class GeneralMessageDB(Base):
    __tablename__ = "general_messages"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    message_text = Column(Text)
    author_ai_id = Column(String, index=True)
    tags = Column(JSON) # Using JSON for list of strings
    thread_id = Column(String, nullable=True, index=True)


# --- Database Setup ---
def create_db_and_tables():
    Base.metadata.create_all(bind=engine)

@app.on_event("startup")
async def on_startup():
    create_db_and_tables()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API Key Authentication ---
async def get_api_key(api_key_header: str = Security(API_KEY_HEADER)):
    if api_key_header == API_KEY:
        return api_key_header
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )

# --- Endpoints ---

# BranchUpdate Endpoints
@app.post("/branch_updates/", response_model=BranchUpdate, dependencies=[Depends(get_api_key)])
def create_branch_update(branch_update: BranchUpdateCreate, db: SessionLocal = Depends(get_db)):
    db_branch_update = BranchUpdateDB(**branch_update.model_dump(), timestamp=datetime.utcnow())
    db.add(db_branch_update)
    db.commit()
    db.refresh(db_branch_update)
    return db_branch_update

@app.get("/branch_updates/", response_model=List[BranchUpdate], dependencies=[Depends(get_api_key)])
def read_branch_updates(author_ai_id: Optional[str] = None, skip: int = 0, limit: int = 100, db: SessionLocal = Depends(get_db)):
    query = db.query(BranchUpdateDB)
    if author_ai_id:
        query = query.filter(BranchUpdateDB.author_ai_id == author_ai_id)
    return query.offset(skip).limit(limit).all()

@app.get("/branch_updates/{branch_update_id}", response_model=BranchUpdate, dependencies=[Depends(get_api_key)])
def read_branch_update(branch_update_id: int, db: SessionLocal = Depends(get_db)):
    db_branch_update = db.query(BranchUpdateDB).filter(BranchUpdateDB.id == branch_update_id).first()
    if db_branch_update is None:
        raise HTTPException(status_code=404, detail="BranchUpdate not found")
    return db_branch_update

# BugReport Endpoints
@app.post("/bug_reports/", response_model=BugReport, dependencies=[Depends(get_api_key)])
def create_bug_report(bug_report: BugReportCreate, db: SessionLocal = Depends(get_db)):
    db_bug_report = BugReportDB(**bug_report.model_dump(), timestamp=datetime.utcnow())
    db.add(db_bug_report)
    db.commit()
    db.refresh(db_bug_report)
    return db_bug_report

@app.get("/bug_reports/", response_model=List[BugReport], dependencies=[Depends(get_api_key)])
def read_bug_reports(
    discovered_by_ai_id: Optional[str] = None,
    file_path: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: SessionLocal = Depends(get_db)
):
    query = db.query(BugReportDB)
    if discovered_by_ai_id:
        query = query.filter(BugReportDB.discovered_by_ai_id == discovered_by_ai_id)
    if file_path:
        query = query.filter(BugReportDB.file_path == file_path)
    if status:
        query = query.filter(BugReportDB.status == status)
    return query.offset(skip).limit(limit).all()

@app.get("/bug_reports/{bug_report_id}", response_model=BugReport, dependencies=[Depends(get_api_key)])
def read_bug_report(bug_report_id: int, db: SessionLocal = Depends(get_db)):
    db_bug_report = db.query(BugReportDB).filter(BugReportDB.id == bug_report_id).first()
    if db_bug_report is None:
        raise HTTPException(status_code=404, detail="BugReport not found")
    return db_bug_report

# SolutionKnowledge Endpoints
@app.post("/solution_knowledge/", response_model=SolutionKnowledge, dependencies=[Depends(get_api_key)])
def create_solution_knowledge(solution_knowledge: SolutionKnowledgeCreate, db: SessionLocal = Depends(get_db)):
    db_solution_knowledge = SolutionKnowledgeDB(**solution_knowledge.model_dump(), timestamp=datetime.utcnow())
    if solution_knowledge.related_bug_id:
        bug_report = db.query(BugReportDB).filter(BugReportDB.id == solution_knowledge.related_bug_id).first()
        if not bug_report:
            raise HTTPException(status_code=404, detail=f"BugReport with id {solution_knowledge.related_bug_id} not found")
    db.add(db_solution_knowledge)
    db.commit()
    db.refresh(db_solution_knowledge)
    return db_solution_knowledge

@app.get("/solution_knowledge/", response_model=List[SolutionKnowledge], dependencies=[Depends(get_api_key)])
def read_solution_knowledge(
    author_ai_id: Optional[str] = None,
    verified_working: Optional[bool] = None,
    related_bug_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: SessionLocal = Depends(get_db)
):
    query = db.query(SolutionKnowledgeDB)
    if author_ai_id:
        query = query.filter(SolutionKnowledgeDB.author_ai_id == author_ai_id)
    if verified_working is not None:
        query = query.filter(SolutionKnowledgeDB.verified_working == verified_working)
    if related_bug_id is not None:
        query = query.filter(SolutionKnowledgeDB.related_bug_id == related_bug_id)
    return query.offset(skip).limit(limit).all()

@app.get("/solution_knowledge/{solution_knowledge_id}", response_model=SolutionKnowledge, dependencies=[Depends(get_api_key)])
def read_solution_knowledge_item(solution_knowledge_id: int, db: SessionLocal = Depends(get_db)):
    db_solution_knowledge = db.query(SolutionKnowledgeDB).filter(SolutionKnowledgeDB.id == solution_knowledge_id).first()
    if db_solution_knowledge is None:
        raise HTTPException(status_code=404, detail="SolutionKnowledge not found")
    return db_solution_knowledge

# GeneralMessage Endpoints
@app.post("/general_messages/", response_model=GeneralMessage, dependencies=[Depends(get_api_key)])
def create_general_message(general_message: GeneralMessageCreate, db: SessionLocal = Depends(get_db)):
    db_general_message = GeneralMessageDB(**general_message.model_dump(), timestamp=datetime.utcnow())
    db.add(db_general_message)
    db.commit()
    db.refresh(db_general_message)
    return db_general_message

@app.get("/general_messages/", response_model=List[GeneralMessage], dependencies=[Depends(get_api_key)])
def read_general_messages(
    author_ai_id: Optional[str] = None,
    tags: Optional[List[str]] = None, # This will require more complex querying for list containment
    thread_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: SessionLocal = Depends(get_db)
):
    query = db.query(GeneralMessageDB)
    if author_ai_id:
        query = query.filter(GeneralMessageDB.author_ai_id == author_ai_id)
    if tags:
        # This is a simple way; for more complex scenarios, consider full-text search or array operations if DB supports
        for tag in tags:
            query = query.filter(GeneralMessageDB.tags.contains(tag)) # Adjust based on DB JSON query capabilities
    if thread_id:
        query = query.filter(GeneralMessageDB.thread_id == thread_id)
    return query.offset(skip).limit(limit).all()

@app.get("/general_messages/{general_message_id}", response_model=GeneralMessage, dependencies=[Depends(get_api_key)])
def read_general_message(general_message_id: int, db: SessionLocal = Depends(get_db)):
    db_general_message = db.query(GeneralMessageDB).filter(GeneralMessageDB.id == general_message_id).first()
    if db_general_message is None:
        raise HTTPException(status_code=404, detail="GeneralMessage not found")
    return db_general_message

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
