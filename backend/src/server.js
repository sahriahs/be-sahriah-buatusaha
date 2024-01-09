const express = require("express")
const app = express()
const port = 5000
const bodyParser = require("body-parser")
const db = require("./connection")
const response = require("./response")

app.use(bodyParser.json())

app.get("/", (req, res) => {
  response(200, "ready to go", "SUCCSESS", res)

})

app.get("/mahasiswa", (req, res) => {
  const sql = "SELECT * FROM mahasiswa"
  db.query(sql, (error, result) => { 
    // ERROR HANDLING
    if(error) throw error
    response(200, result, "list mahasiswa muncul", res)
    
  })
})

app.get("/mahasiswa/:nim", (req, res) => {
  const nim = req.params.nim
  const sql = `SELECT * FROM mahasiswa WHERE nim = ${nim}`
  db.query(sql, (error, result) => {
    if(error) throw error
    response(200, result, `list mahasiswa by id ${nim}`, res)
  })
})
// app.get("/mahasiswa", (req, res) => {
  //   response(200, "list mahasiswa muncul")
  // })
  
  
  app.post("/mahasiswa", (req, res) => {
    const {nim, nama_lengkap, kelas, alamat} = req.body

    const sql = `INSERT INTO mahasiswa VALUES ('', ${nim}, '${nama_lengkap}', '${kelas}', '${alamat}')`
    
    db.query(sql, (error, result) => {
      if(error) throw error
      response(500, "Invalid", "error", res)
      if (result?.affectedRows) {
        const data = {
          isSuccess: result.affectedRows,
          id: result.insertId,
        }
        response(200, data, "Success to post data", res)
      }
  })
})

app.put("/mahasiswa", (req, res) => {
  const { nim, nama_lengkap, kelas, alamat } = req.body

  const sql = `UPDATE mahasiswa 
  SET nama_lengkap = '${nama_lengkap}', 
  kelas = '${kelas}', alamat = '${alamat}' 
  WHERE nim = '${nim}'`

  db.query(sql, (error, result) => {
    if (error) response(500, "invalid", "error", res)
    if (result?.affectedRows){
      const data = {
        isSuccess: result.affectedRows,
        message: result.message,
      }
      response(200, data, "Success to updete data", res)
    } else {
      response(500, "nothing nim match", "Error", res)
    }
  })
})

app.delete("/mahasiswa", (req, res) => {
  const {nim} = req.body
  const sql = `DELETE FROM mahasiswa WHERE nim = ${nim}`
  
  db.query(sql, (error, result) => {
    if (error) response(500, "invalid", "error", res)
    if (result?.affectedRows){
      response(200, result.affectedRows, "Success to delete data", res)
    } else {
      response(500, "nothing nim match", "Error", res)
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
