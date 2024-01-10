// ! Dont change this code
const {
  fetchProductsData,
  setProductsCards,
  convertToRupiah,
  countDiscount,
} = require("../src/index.js");
const cartData = require("../src/data/cart.js");

// @ Write your code here

// Asyncronous Testing
// https://jestjs.io/docs/asynchronous

// Describe block for testing product API
describe("Product API Testing", () => {
  // Test fetching product data by ID
  test("should return product data with id 1", async () => {
    const productId = 1;
    const productData = await fetchProductsData(productId);
    expect(productData.id).toBe(productId);
  });

  // Test checking the number of products with a limit
  test("should check products.length with limit", async () => {
    const productsLimit = 30;
    const productData = await fetchProductsData();
    expect(productData.products.length).toBe(productsLimit);
  });

  // Test fetching product data by ID and checking its title
  test("should return product data with id 5", async () => {
    const productId = 5;
    const productData = await fetchProductsData(productId);
    expect(productData.id).toBe(productId);
    expect(productData.title).toEqual("Huawei P30");
  });
});

// Mocking
// https://jestjs.io/docs/mock-functions

// Mocking fetchCartsData function from dataService module
const { fetchCartsData } = require('../src/dataService');
jest.mock('../src/dataservice', () => {
  const originalModule = jest.requireActual('../src/dataservice');
  return {
    ...originalModule,
    __esModule: true,
    fetchCartsData: jest.fn(),
  };
});

// Describe block for testing cart API
describe('Cart API Testing', () => {
  // Test comparing total cart items with length of fetched data
  test('should compare total cart items with length of fetched data', async () => {
    fetchCartsData.mockResolvedValue(cartData.carts);
    const cartsData = await fetchCartsData();
    const totalItems = cartsData.length;
    const expectedTotal = cartData.total;
    expect(totalItems).toBe(expectedTotal);
  });

  // Test comparing total length of carts data with a predefined total
  test('should compare total length of carts data with total', async () => {
    fetchCartsData.mockResolvedValue([
      { id: 1, productId: 1, quantity: 1 },
      { id: 2, productId: 2, quantity: 2 },
    ]);
    const cartsData = await fetchCartsData();
    const totalLength = cartsData.reduce((acc, cart) => acc + cart.quantity, 0);
    expect(totalLength).toBe(3);
  });
}); 

// Setup & Teardown
// https://jestjs.io/docs/setup-teardown

// Fetch product data before all tests in this describe block
let productData;

beforeAll(async () => {
  productData = await fetchProductsData();
});

// Describe block for testing product utility functions
describe("Product Utility Testing", () => {
  // Describe block for testing convertToRupiah function
  describe("convertToRupiah", () => {
    // Test converting 100 dollars to rupiah
    test('should convert 100 dollars into rupiah', () => {
      const priceInRupiah = convertToRupiah(100);
      expect(priceInRupiah).toMatch(/Rp\s1\.543\.600,\d{2}/);
      expect(typeof priceInRupiah).toBe('string');
    });
    
    // Test converting 1000 dollars to rupiah
    test('should convert 1000 dollars into rupiah', () => {
      const priceInRupiah = convertToRupiah(1000);
      expect(priceInRupiah).toMatch(/Rp\s15\.436\.000,\d{2}/);
    });      
  });

  // Describe block for testing countDiscount function
  describe("countDiscount", () => {
    // Test calculating discounted price correctly
    test("it should calculate discounted price correctly", () => {
      const price = 1000;
      const discount = 10;
      const result = countDiscount(price, discount);
      expect(result).toEqual(900);
    });

    // Test handling zero discount
    test("it should handle zero discount", () => {
      const price = 1000;
      const discount = 0;
      const result = countDiscount(price, discount);
      expect(result).toEqual(1000);
    });
  });

  // Describe block for testing setProductsCards function
  describe("setProductsCards", () => {
    // Test if setProductsCards returns an array of products with specific keys
    test("it should return an array of products with specific keys", () => {
      const productsCards = setProductsCards(productData.products);
      const firstProductKeys = Object.keys(productsCards[0]);
      const expectedKeys = ["price", "after_discount", "image"];
      expect(firstProductKeys).toEqual(expect.arrayContaining(expectedKeys));
    });
  });
});