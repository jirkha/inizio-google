// 'supertest' allows to make fake HTTP requests to the server
import request from "supertest";
import app from "./server";

// It allows to replace the global 'fetch' function with a fake (mock) version
global.fetch = jest.fn();

// 'describe' is a function from jest. It groups related tests together
describe("GET /api/inizio-google", () => {
  // It clears the fake 'fetch' function to make sure that each test starts fresh
  beforeEach(() => {
    jest.mocked(fetch).mockClear();
  });

  // 'it' defines individual test cases
  it("should return 400 if the query parameter is missing", async () => {
    const res = await request(app).get("/api/inizio-google");

    // It expects the server to respond with a status code of 400 (Bad Request) and to have a property named 'error'
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 200 with data on a successful API call", async () => {
    // A fake response that we want our fake API call to return
    const mockApiResponse = {
      organic_results: [
        {
          position: 1,
          title: "Test Title",
          link: "https://test.com/",
          displayed_link: "test.com",
          snippet: "A test snippet",
          source: "Test Source",
        },
      ],
    };

    // It returns a successful response with the fake data
    jest.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    const res = await request(app).get("/api/inizio-google?query=validquery");
    expect(res.statusCode).toEqual(200);

    // It checks if the body of the response from our server is the same as the fake data
    expect(res.body).toEqual(mockApiResponse);
  });

  // It tests if the server returns 500 when the API key is not configured
  it("should return 500 if API key is not configured", async () => {
    // Temporarily remove the API key to simulate the error
    const originalApiKey = process.env.SERPAPI_KEY;
    delete process.env.SERPAPI_KEY;

    const res = await request(app).get("/api/inizio-google?query=test");

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty("error");

    process.env.SERPAPI_KEY = originalApiKey;
  });

  // It tests if the server returns an error when the external API call fails
  it("should return a 502 error if the external API call fails", async () => {
    // It tells to return a failed response
    jest.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 502,
      json: async () => ({ error: "External API isn't working" }),
    } as Response);

    const res = await request(app).get("/api/inizio-google?query=test");

    expect(res.statusCode).toEqual(502);
    expect(res.body).toHaveProperty("error");
  });
});
