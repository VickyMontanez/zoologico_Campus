import express from "express";
import { ObjectId} from "mongodb";
import {con}from "../../db/atlas.js";
import { DTOData, proxyAreas, middlewareVerify } from "../../middleware/proxyAreas.js";
import { LimitQuery } from "../../helpers/config.js";

const appAreas = express();
appAreas.use(express.json());
appAreas.use(LimitQuery());

appAreas.get("/", middlewareVerify, async (req, res) => {
    let db = await con();
    let collection = db.collection("areas");
    let result = await collection.find({}).toArray();
    if (!result || result.length === 0) {
        res.status(404).json({
            status: 404,
            message: "Not Found"
        });
    } else {
        res.send(result);
    }
});

appAreas.post("/post", middlewareVerify, proxyAreas, DTOData, async (req, res) => {
    try {
        const db = await con();
        const collection = db.collection('areas');
        await collection.insertOne({...req.body});
        res.status(201).json({
            satus: 201,
            message: "Area Insertada Exitosamente :)"
        });
    } catch (e) {
        res.status(500).json({
            satus: 500,
            message: "Internal Server Error :(",
            error: e.message
        });
    }
});

appAreas.put("/update/:id", middlewareVerify, proxyAreas, DTOData, async (req, res) => {
    try {
        let _id = parseInt(req.params.id);
        const db = await con();
        const collection = db.collection('areas');
        const updateData = req.body;
        let result = await collection.updateOne({ _id: _id }, { $set: updateData }) 
        result.matchedCount === 1 ? 
            res.send({ message: "Area Exitosamente Actualizada :)" }):
            res.send({ message: "No se encontró Data" });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            satus: 500,
            message: `Internal Server Error :(`,
            error: e.message
        });
    }
});

appAreas.delete("/delete/:id", middlewareVerify, async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        const db = await con();
        const collection = db.collection('areas');
        await collection.deleteOne({
            _id: id
        });
        res.status(201).json({
            satus: 201,
            message: "Area Eliminada Exitosamente :)"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            satus: 500,
            message: `Internal Server Error :(`,
            error: error.message
        });
    }
});
export default appAreas;