const mongoose = require('mongoose')
const { Schema } = mongoose;

const TableSchema = new Schema({
    DRR_Data: {
    type: String,
    required: true
  },
  Last_updated: {
    type: String,
    required: true
  },
  Month_Year: {
    type: String,
    required: true
  },
  end_date: {
    type: String,
    required: true
  },
  excluded_date: {
    type: [String]
  },
  lead_count: {
    type: Number,
    required: true
  },
  number_Days: {
    type: Number,
    required: true
  },
  start_date: {
    type: String,
    required: true
  }
});
const table = mongoose.model('Table', TableSchema)
module.exports = table;