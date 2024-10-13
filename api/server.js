const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const bodyParser = require('body-parser')

server.use(middlewares)
server.use(bodyParser.json())

// Add custom rewrite routes
server.use(jsonServer.rewriter({
    '/api/*': '/$1',
    '/blog/:resource/:id/show': '/:resource/:id'
}))

// Custom POST route for creating a new resource
server.post('/api/:resource', (req, res) => {
    const resource = req.params.resource;
    const db = router.db; // Lowdb instance
    const data = req.body;

    const collection = db.get(resource);
    if (!collection) {
        return res.status(404).send('Resource not found');
    }

    const created = collection.insert(data).write();
    res.status(201).json(created);
});

// Custom PUT route for updating a resource by ID
server.put('/api/:resource/:id', (req, res) => {
    const resource = req.params.resource;
    const id = req.params.id;
    const db = router.db;
    const data = req.body;

    const collection = db.get(resource);
    if (!collection) {
        return res.status(404).send('Resource not found');
    }

    const updated = collection.find({ id }).assign(data).write();
    if (!updated) {
        return res.status(404).send('Resource not found');
    }

    res.status(200).json(updated);
});

// Custom DELETE route for deleting a resource by ID
server.delete('/api/:resource/:id', (req, res) => {
    const resource = req.params.resource;
    const id = req.params.id;
    const db = router.db;

    const collection = db.get(resource);
    if (!collection) {
        return res.status(404).send('Resource not found');
    }

    const deleted = collection.remove({ id }).write();
    if (!deleted.length) {
        return res.status(404).send('Resource not found');
    }

    res.status(200).json({ message: 'Resource deleted successfully' });
});

server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
})

// Export the Server API
module.exports = server
