import os

# Specify the directory containing files to cache
# cache_directory = ''  # Change this to your files directory
cache_directory = os.getcwd()  # This sets it to the current working directory


# Gather all files to cache
files_to_cache = []
for root, dirs, files in os.walk(cache_directory):
    for file in files:
        if file.endswith(('.js', '.html', '.css', '.png', '.jpg', '.gif', '.svg')):  # Add file types as needed
            files_to_cache.append(os.path.join(root, file))

# Create the service-worker.js content
service_worker_content = '''self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('your-cache-name').then((cache) => {
            return cache.addAll([
'''

# Add the files to the service worker content
for file in files_to_cache:
    # Convert the file path to a relative URL (adjust based on your file structure)
    relative_path = os.path.relpath(file, cache_directory)
    service_worker_content += f'                "{relative_path}",\n'

# Complete the service worker script
service_worker_content += '''            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
'''

# Write the content to service-worker.js
with open('service-worker.js', 'w') as f:
    f.write(service_worker_content)

print("service-worker.js has been generated successfully.")
