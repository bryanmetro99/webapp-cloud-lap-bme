const { BlobServiceClient } = require('@azure/storage-blob');
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = 'images';

async function listBlobs() {
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  let blobs = [];
  for await (const blob of containerClient.listBlobsFlat()) {
    blobs.push(`<img src="https://storagelab13032026bmetp.blob.core.windows.net/images/${blob.name}" width="200" />`);
  }
  return blobs.join('<br>');
}

require('http').createServer(async (req, res) => {
  const blobs = await listBlobs();
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`<html><body>${blobs}</body></html>`);
}).listen(process.env.PORT || 3000);
