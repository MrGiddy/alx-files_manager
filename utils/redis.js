import { createClient } from 'redis';
import { promisify } from 'util';

/**
 * Represents a Redis client
 */
class RedisClient {
  /**
     * Creates a new RedisClient instance
     */
  constructor() {
    this.client = createClient();
    this.alive = true;
    // handle connection errors
    this.client.on('error', (err) => {
      console.log(err);
      this.alive = false;
    });
    // handle successful connection
    this.client.on('connect', () => {
      this.alive = true;
    });
  }

  /**
     * Checks if the client is connected to redis
     * @returns {Boolean}
     */
  isAlive() {
    return this.alive;
  }

  /**
     * Retrieves a value from Redis by key
     * @param {String} key - The key to hold the value
     * @returns {String | Object}
     */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
     * Stores a key:value pair with expiration
     * @param {String} key - The key to hold the value
     * @param {String | Number | Boolean} value - The item to store
     * @param {Number} duration - The expiration time in seconds
     */
  async set(key, value, duration) {
    await promisify(this.client.SETEX).bind(this.client)(key, duration, value);
  }

  /**
   * Removes value associated with key from Redis
   * @param {string} key
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
