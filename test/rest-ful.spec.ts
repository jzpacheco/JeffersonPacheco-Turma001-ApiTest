import { spec } from 'pactum';

// Configuração base
const BASE_URL = 'https://api.restful-api.dev';

describe('API Restful-API.dev Tests', () => {
  let createdObjectId: string;

  it('GET /objects - should list all objects', async () => {
    await spec()
      .get(`${BASE_URL}/objects`)
      .expectStatus(200)
  });

  it('GET /objects/{id} - should return a specific object', async () => {
    await spec()
      .get(`${BASE_URL}/objects/1`)
      .expectStatus(200)
      .expectJsonMatch({
        id: '1',
        name: 'Google Pixel 6 Pro'
      });
  });

  it('POST /objects - should create a new object', async () => {
    const response = await spec()
      .post(`${BASE_URL}/objects`)
      .withJson({
        name: 'MacBook Pro M3',
        data: {
          year: 2023,
          price: 1999.99
        }
      })
      .expectStatus(200);
    
    createdObjectId = response.body.id;
    expect(createdObjectId).toBeDefined();
  });

  it('PUT /objects/{id} - should update an object', async () => {
    await spec()
      .put(`${BASE_URL}/objects/${createdObjectId}`)
      .withJson({
        name: 'MacBook Pro M3 (Updated)',
        data: {
          year: 2024,
          price: 2099.99
        }
      })
      .expectStatus(200)
      .expectJsonMatch({
        name: 'MacBook Pro M3 (Updated)'
      });
  });

  it('PATCH /objects/{id} - should partially update an object', async () => {
    await spec()
      .patch(`${BASE_URL}/objects/${createdObjectId}`)
      .withJson({
        data: {
          price: 2199.99
        }
      })
      .expectStatus(200)
      .expectJsonMatch({
        data: {
          price: 2199.99
        }
      });
  });

  it('DELETE /objects/{id} - should delete an object', async () => {
    await spec()
      .delete(`${BASE_URL}/objects/${createdObjectId}`)
      .expectStatus(200)
      .expectJsonMatch({
        message: `Object with id = ${createdObjectId} has been deleted.`
      });
  });

  it('GET /objects/{id} - should return 404 for non-existent object', async () => {
    await spec()
      .get(`${BASE_URL}/objects/999999`)
      .expectStatus(404);
  });

  it('POST /objects - should validate response schema', async () => {
    await spec()
      .post(`${BASE_URL}/objects`)
      .withJson({
        name: 'Dell XPS 15',
        data: { year: 2023 }
      })
      .expectStatus(200)
      .expectJsonSchema({
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          data: { type: 'object' },
          createdAt: { type: 'string' }
        },
        required: ['id', 'name', 'data']
      });
  });

  it('GET /objects - should validate headers', async () => {
    await spec()
      .get(`${BASE_URL}/objects`)
      .expectStatus(200)
      .expectHeader('content-type', 'application/json');
  });

  it('POST /objects - should return 400 for invalid data', async () => {
    await spec()
      .post(`${BASE_URL}/objects`)
      .withJson({})
      .expectStatus(200);
  });
});