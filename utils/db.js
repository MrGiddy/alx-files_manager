import { MongoClient } from 'mongodb';

const HOST = process.env.DB_HOST || 'localhost';
const PORT = process.env.DB_PORT || 27017;
const DATABASE = process.env.DB_DATABASE || 'files_manager';
const URI = `mongodb://${HOST}:${PORT}/${DATABASE}`;

class DBClient {
  constructor() {
    this.client = new MongoClient(URI, { useUnifiedTopology: true });
    this.connected = false;
    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      this.connected = true;
    } catch (err) {
      console.error(err);
      this.connected = false;
    }
  }

  /**
   * Checks the connection status of client
   * @returns {Boolean}
   */
  isAlive() {
    return this.connected;
  }

  /**
   * Counts the number of users in 'users' collection
   * @returns {Number}
   */
  async nbUsers() {
    if (!this.connected) {
      throw new Error('Not connected to the database');
    }
    return this.client.db().collection('users').countDocuments();
  }

  /**
   * Counts the number of files in 'files' collection
   * @returns {Number}
   */
  async nbFiles() {
    if (!this.connected) {
      throw new Error('Not connected to the database');
    }
    return this.client.db().collection('files').countDocuments();
  }
}

// Create and export an instance of DBClient
export const dbClient = new DBClient();
export default dbClient;
