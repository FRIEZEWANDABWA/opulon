#!/usr/bin/env python3
"""
Initialize sample products for Opulon platform
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.product import Product, Category

def create_sample_data():
    """Create sample categories and products"""
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        # Create categories
        categories_data = [
            {"name": "Diabetes Care", "description": "Medications and supplies for diabetes management"},
            {"name": "Heart Health", "description": "Cardiovascular medications and monitoring devices"},
            {"name": "Pain Management", "description": "Pain relief medications and treatments"},
            {"name": "Cold & Flu", "description": "Cold, flu, and respiratory care products"},
            {"name": "Blood Pressure", "description": "Hypertension medications and monitoring equipment"},
            {"name": "Antibiotics", "description": "Antibiotic medications for infection treatment"},
        ]
        
        categories = {}
        for cat_data in categories_data:
            existing_cat = db.query(Category).filter(Category.name == cat_data["name"]).first()
            if not existing_cat:
                category = Category(**cat_data)
                db.add(category)
                db.commit()
                db.refresh(category)
                categories[cat_data["name"]] = category
                print(f"✅ Created category: {category.name}")
            else:
                categories[cat_data["name"]] = existing_cat
                print(f"📁 Category exists: {existing_cat.name}")
        
        # Create products
        products_data = [
            {
                "name": "Metformin 500mg",
                "description": "Extended-release metformin for type 2 diabetes management",
                "price": 12.50,
                "stock_quantity": 100,
                "sku": "MET-500-ER",
                "category_slug": "diabetes-care"
            },
            {
                "name": "Insulin Glargine 100 units/mL",
                "description": "Long-acting insulin for diabetes treatment",
                "price": 89.99,
                "stock_quantity": 50,
                "sku": "INS-GLA-100",
                "category_slug": "diabetes-care"
            },
            {
                "name": "Lisinopril 10mg",
                "description": "ACE inhibitor for high blood pressure and heart failure",
                "price": 8.75,
                "stock_quantity": 200,
                "sku": "LIS-10MG",
                "category_slug": "heart-health"
            },
            {
                "name": "Atorvastatin 20mg",
                "description": "Statin medication for cholesterol management",
                "price": 15.30,
                "stock_quantity": 150,
                "sku": "ATO-20MG",
                "category_slug": "heart-health"
            },
            {
                "name": "Ibuprofen 200mg",
                "description": "Non-steroidal anti-inflammatory drug for pain relief",
                "price": 6.99,
                "stock_quantity": 300,
                "sku": "IBU-200MG",
                "category_slug": "pain-management"
            },
            {
                "name": "Acetaminophen 500mg",
                "description": "Pain reliever and fever reducer",
                "price": 5.49,
                "stock_quantity": 250,
                "sku": "ACE-500MG",
                "category_slug": "pain-management"
            },
            {
                "name": "Amoxicillin 500mg",
                "description": "Broad-spectrum antibiotic for bacterial infections",
                "price": 18.75,
                "stock_quantity": 80,
                "sku": "AMO-500MG",
                "category_slug": "antibiotics"
            },
            {
                "name": "Azithromycin 250mg",
                "description": "Macrolide antibiotic for respiratory infections",
                "price": 25.99,
                "stock_quantity": 60,
                "sku": "AZI-250MG",
                "category_slug": "antibiotics"
            },
            {
                "name": "Amlodipine 5mg",
                "description": "Calcium channel blocker for hypertension",
                "price": 11.25,
                "stock_quantity": 120,
                "sku": "AML-5MG",
                "category_slug": "blood-pressure"
            },
            {
                "name": "Losartan 50mg",
                "description": "ARB medication for high blood pressure",
                "price": 13.80,
                "stock_quantity": 90,
                "sku": "LOS-50MG",
                "category_slug": "blood-pressure"
            }
        ]
        
        # Map category slugs to names
        category_map = {
            "diabetes-care": "Diabetes Care",
            "heart-health": "Heart Health", 
            "pain-management": "Pain Management",
            "cold-flu": "Cold & Flu",
            "blood-pressure": "Blood Pressure",
            "antibiotics": "Antibiotics"
        }
        
        for prod_data in products_data:
            category_slug = prod_data.pop("category_slug")
            category_name = category_map[category_slug]
            category = categories[category_name]
            
            existing_prod = db.query(Product).filter(Product.sku == prod_data["sku"]).first()
            if not existing_prod:
                product = Product(**prod_data, category_id=category.id)
                db.add(product)
                db.commit()
                db.refresh(product)
                print(f"✅ Created product: {product.name}")
            else:
                print(f"📦 Product exists: {existing_prod.name}")
        
        print(f"\\n🎉 Sample data initialization completed!")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()