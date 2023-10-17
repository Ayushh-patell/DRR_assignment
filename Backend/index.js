const express = require('express')
const cors = require('cors')
const DBConnect = require('./DBConnect')
const table = require('./TableContentModel')

const app = express()
const port = 5000

DBConnect()
app.use(cors({
    origin: ['http://localhost:3000', 'http://example.com']
  }));
app.use(express.json())

app.get('/', async(req, res) => {
    try {

        // Retrieve all documents from the "tables" collection
        const tables = await table.find({});
        res.json(tables); // Send the documents as a JSON response
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
app.post('/create', async(req, res) => {
    try {
        const content = await table.create({
            DRR_Data: req.body.DRR_Data,
            Last_updated: req.body.Last_updated,
            Month_Year: req.body.Month_Year,
            end_date: req.body.end_date,
            excluded_date: req.body.excluded_date,
            lead_count: req.body.lead_count,
            number_Days: req.body.number_Days,
            start_date: req.body.start_date
        });
        res.send(content)
    } catch (error) {
        console.log(error)
    }

})
app.delete('/delete/:id', async(req, res) => {
    const { id } = req.params;
    try {
        // Delete the document by its ID
        const deleted = await table.findByIdAndDelete(id);

        if (deleted) {
            res.json({ message: 'Document deleted successfully' });
        } else {
            res.status(400).json({ error: 'Error occured while deletng' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
app.put('/update/:id', async(req, res) => {
    const { id } = req.params;
    const updatedData = req.body; 

    try {
        // Update the document by its ID
        const updated = await table.findByIdAndUpdate(id, updatedData, { new: true });

        if (updated) {
            res.json(updated);
        } else {
            res.status(400).json({ error: 'Error occured while updating the document' });
        }
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})