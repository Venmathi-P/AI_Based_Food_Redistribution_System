"""Initialize the SQLite database and insert optional sample data."""
from backend.app import db as _db
from backend.app import models as _models


def init_db(seed: bool = True):
    print('Creating database tables...')
    _models.Base.metadata.create_all(bind=_db.engine)
    if seed:
        print('Seeding sample data...')
        session = _db.SessionLocal()
        try:
            # Add only if empty
            if session.query(_models.Inventory).count() == 0:
                session.add_all([
                    _models.Inventory(name='Rice Bags', quantity=50, expiry_date='2026-12-31', owner='Business A'),
                    _models.Inventory(name='Bread Loaves', quantity=30, expiry_date='2026-08-10', owner='Bakery B'),
                ])
            if session.query(_models.Donation).count() == 0:
                session.add_all([
                    _models.Donation(name='Vegetables', quantity=20, donor='Business A', status='available'),
                    _models.Donation(name='Canned Beans', quantity=60, donor='Store C', status='available'),
                ])
            session.commit()
        finally:
            session.close()


if __name__ == '__main__':
    init_db(seed=True)
