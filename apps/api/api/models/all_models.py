from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Boolean, text
from sqlalchemy.orm import relationship
import datetime
from api.core.database import Base

class Organization(Base):
    __tablename__ = 'organizations'
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    departments = relationship("Department", back_populates="organization", cascade="all, delete-orphan")
    thrust_areas = relationship("ThrustArea", back_populates="organization", cascade="all, delete-orphan")
    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")

class Department(Base):
    __tablename__ = 'departments'
    id = Column(String, primary_key=True)
    org_id = Column(String, ForeignKey('organizations.id', ondelete='CASCADE'), nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="departments")
    users = relationship("User", back_populates="department")

class ThrustArea(Base):
    __tablename__ = 'thrust_areas'
    id = Column(String, primary_key=True)
    org_id = Column(String, ForeignKey('organizations.id', ondelete='CASCADE'), nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="thrust_areas")
    goals = relationship("Goal", back_populates="thrust_area")

class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True)
    org_id = Column(String, ForeignKey('organizations.id', ondelete='CASCADE'), nullable=False)
    dept_id = Column(String, ForeignKey('departments.id', ondelete='SET NULL'), nullable=True)
    role = Column(String, default="EMPLOYEE") # EMPLOYEE, MANAGER, ADMIN
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    manager_id = Column(String, ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="users")
    department = relationship("Department", back_populates="users")
    goals = relationship("Goal", back_populates="user")
    
    manager = relationship("User", remote_side=[id], backref="direct_reports")

class Goal(Base):
    __tablename__ = 'goals'
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    thrust_area_id = Column(String, ForeignKey('thrust_areas.id', ondelete='CASCADE'), nullable=False)
    title = Column(String(80), nullable=False)
    uom = Column(String, default="PERCENTAGE") # NUMERIC, PERCENTAGE, TIMELINE, ZERO_BASED
    target = Column(Float, nullable=False)
    weightage = Column(Integer, default=0)
    status = Column(String, default="DRAFT") # DRAFT, SUBMITTED, APPROVED, LOCKED
    is_cascaded = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="goals")
    thrust_area = relationship("ThrustArea", back_populates="goals")
    check_ins = relationship("CheckIn", back_populates="goal", cascade="all, delete-orphan")

class CheckIn(Base):
    __tablename__ = 'check_ins'
    id = Column(String, primary_key=True)
    goal_id = Column(String, ForeignKey('goals.id', ondelete='CASCADE'), nullable=False)
    quarter = Column(String, nullable=False) # Q1, Q2, Q3, Q4
    actual = Column(Float, nullable=False)
    manager_comment = Column(String, nullable=True)
    status = Column(String, default="SUBMITTED") # SUBMITTED, APPROVED, REJECTED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    goal = relationship("Goal", back_populates="check_ins")

class AuditLog(Base):
    __tablename__ = 'audit_logs'
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(String, ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    action = Column(String, nullable=False) # EDIT, APPROVE, SUBMIT, CHECKIN, CASCADE
    field_changed = Column(String, nullable=True)
    old_value = Column(String, nullable=True)
    new_value = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
