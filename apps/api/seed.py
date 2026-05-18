import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Database URL should ideally come from environment variables
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/goalflow")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def reset_and_seed_db():
    print("Starting database reset and seed...")
    
    # Locate SQL scripts
    base_dir = os.path.dirname(os.path.abspath(__file__))
    reset_file = os.path.join(base_dir, "reset.sql")
    seed_file = os.path.join(base_dir, "seed.sql")

    try:
        with engine.begin() as conn:
            # 1. Run Reset
            print("Running reset.sql...")
            with open(reset_file, "r") as f:
                reset_sql = f.read()
                # Split by statements to avoid issues with driver parsing
                for stmt in reset_sql.split(';'):
                    if stmt.strip():
                        conn.execute(text(stmt))

            # 2. Run Seed
            print("Running seed.sql...")
            with open(seed_file, "r") as f:
                seed_sql = f.read()
                for stmt in seed_sql.split(';'):
                    if stmt.strip():
                        conn.execute(text(stmt))
            
            print("✅ Database successfully seeded for the live demo!")
    
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    reset_and_seed_db()
