# DataNodes Downloader

**DataNodes Downloader** is a utility for bulk downloading files from the DataNodes site using POST requests to obtain download links. The program accepts links from the user, processes them sequentially, and saves the redirect URLs to a text file named `results.txt`.

## Usage Guide

### Requirements

- **Node.js** installed on your system.
- **Axios** for making HTTP requests. Install it with the following command:

  ```
  npm init -y
  ```
      npm install axios

1. Run the script:
```
node datanodes_downloader.js
```

2. Enter the links:
   * Paste the links one per line and press Enter.
   * To finish input and start processing, enter an empty line and press Enter.

3. Results:
   * After processing all the links, the results will be saved in the results.txt file.
