import { test, expect } from '@playwright/test';



test.describe('Petstore API - Complete Functional Suite', () => {
    const baseUrl = 'https://petstore.swagger.io/v2';
    
 
    const testPet = {
        id: Math.floor(Math.random() * 1000000), 
        name: 'Alpha-Test-Pet',
        status: 'available'
    };

    const testOrder = {
        id: Math.floor(Math.random() * 100),
        petId: testPet.id,
        quantity: 1,
        status: 'placed',
        complete: true
    };


    test('1. Add a new pet to the store (POST)', async ({ request }) => {
        const response = await request.post(`${baseUrl}/pet`, {
            data: testPet
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.name).toBe(testPet.name);
    });

    test('2. Find pet by ID (GET)', async ({ request }) => {
        const response = await request.get(`${baseUrl}/pet/${testPet.id}`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.id).toBe(testPet.id);
    });

    test('3. Update an existing pet (PUT)', async ({ request }) => {
        const updatedPet = { ...testPet, name: 'Alpha-Pet-Updated', status: 'sold' };
        const response = await request.put(`${baseUrl}/pet`, {
            data: updatedPet
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.name).toBe('Alpha-Pet-Updated');
    });


    test('4. Place an order for a pet (POST)', async ({ request }) => {
        const response = await request.post(`${baseUrl}/store/order`, {
            data: testOrder
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.id).toBe(testOrder.id);
    });

    test('5. Find purchase order by ID (GET)', async ({ request }) => {
        const response = await request.get(`${baseUrl}/store/order/${testOrder.id}`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.petId).toBe(testPet.id);
    });

    test('6. Delete purchase order (DELETE)', async ({ request }) => {
        const response = await request.delete(`${baseUrl}/store/order/${testOrder.id}`);
        expect(response.status()).toBe(200);
    });


    test('7. Delete the pet and verify removal (DELETE & GET)', async ({ request }) => {
        // Delete the pet
        const deleteResponse = await request.delete(`${baseUrl}/pet/${testPet.id}`);
        expect(deleteResponse.status()).toBe(200);

        // Negative Scenario: Try to find the deleted pet
        const verifyDeleted = await request.get(`${baseUrl}/pet/${testPet.id}`);
        expect(verifyDeleted.status()).toBe(404); // Asserting 'Not Found'
    });
});
