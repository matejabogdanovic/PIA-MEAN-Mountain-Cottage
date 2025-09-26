// import express from 'express'
// import BookM from '../models/book'

// export class BookController{
//     getAll = (req: express.Request, res: express.Response)=>{
//         BookM.find({}).sort({pages: 1}).then(books=>{
//             res.json(books)
//         }).catch((err)=>{
//             console.log(err)
//         })
//     }

//     deleteBook = (req: express.Request, res: express.Response)=>{
//         BookM.deleteOne({name: req.body.name}).then(books=>{
//             res.json({message: "Book deleted"})
//         }).catch((err)=>{
//             console.log(err)
//             res.json({message: "Fail"})
//         })
//     }

//     updateBook = (req: express.Request, res: express.Response)=>{
//         BookM.updateOne({name: req.body.name},
//             {pages: req.body.pages}).then(books=>{
//             res.json({message: "Book updated"})
//         }).catch((err)=>{
//             console.log(err)
//             res.json({message: "Fail"})
//         })
//     }
// }
