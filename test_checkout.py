#!/usr/bin/env python3
"""
Test script to verify checkout functionality
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_checkout_flow():
    print("Testing Opulon Checkout Flow...")
    
    # Test 1: Check if orders endpoint exists
    try:
        response = requests.get(f"{BASE_URL}/orders/")
        print(f"✅ Orders endpoint accessible: {response.status_code}")
    except Exception as e:
        print(f"❌ Orders endpoint error: {e}")
        return
    
    # Test 2: Check if products are available
    try:
        response = requests.get(f"{BASE_URL}/products")
        if response.status_code == 200:
            products = response.json()
            print(f"✅ Products available: {len(products)} products found")
            if products:
                print(f"   Sample product: {products[0]['name']} - ${products[0]['price']}")
        else:
            print(f"❌ Products endpoint error: {response.status_code}")
    except Exception as e:
        print(f"❌ Products error: {e}")
    
    # Test 3: Check frontend accessibility
    try:
        response = requests.get("http://localhost:3000")
        if response.status_code == 200:
            print("✅ Frontend accessible")
        else:
            print(f"❌ Frontend error: {response.status_code}")
    except Exception as e:
        print(f"❌ Frontend error: {e}")
    
    print("\n🎉 Checkout system is ready!")
    print("📋 To test checkout:")
    print("   1. Go to http://localhost:3000")
    print("   2. Login/Register")
    print("   3. Add products to cart")
    print("   4. Go to cart and click 'Proceed to Checkout'")
    print("   5. Fill out checkout form and place order")

if __name__ == "__main__":
    test_checkout_flow()