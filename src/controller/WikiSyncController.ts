import {Request, Response, Router} from "express";
import {WikiClient} from "../wikiData/WikiClient";
import {Container} from "typedi";

const config = require('../../config.json');
const apiKey = process.env.WIKI_KEY || config.wikiKey;

let router = Router();
router.post('/:apiKey/:pageId?', async (req: Request, res: Response, done: Function) => {
    if (!req.params.apiKey || req.params.apiKey !== apiKey) {
        console.log(`Unauthorized access: no API Key from ${req.ip}`);
        res.status(401).send("Unauthorized: API Key missing!");
    }

    const wikiClient = Container.get(WikiClient);
    const pageId = req.params.pageId;
    if (pageId) {
        wikiClient.syncPage(pageId)
            .then(() => {
                res.status(200).send(JSON.stringify({status: "success"}));
                done();
            })
            .catch((e) => {
                console.error(e);
                res.status(500).send(JSON.stringify({status: e.message}));
                done();
            })
    } else {
        wikiClient.syncAllPages()
            .then(() => {
                res.status(200).send(JSON.stringify({status: "success"}));
                done();
            })
            .catch((e) => {
                console.error(e);
                res.status(500).send(JSON.stringify({status: e.message}));
                done();
            })
    }
});

router.get('/warnings/:apiKey/:pageId', async (req: Request, res: Response) => {
    if (!req.params.apiKey || req.params.apiKey !== apiKey) {
        console.log(`Unauthorized access: no API Key from ${req.ip}`);
        res.status(401).send("Unauthorized: API Key missing!");
    }

    const wikiClient = Container.get(WikiClient);
    const pageId = req.params.pageId;
    if (pageId) {
        wikiClient.getWarnings(pageId)
            .then((wikiWarning) => {
                res.status(200).send(JSON.stringify({status: "success", warnings: wikiWarning.warnings || ""}));
            })
            .catch((e) => {
                console.error(e);
                res.status(500).send(JSON.stringify({status: e.message}));
            })
    } else {
        res.status(400).send(JSON.stringify({status: `Page ${pageId} not indexed`}));
    }
});

router.get('/pagesWithWarnings/:apiKey', async (req: Request, res: Response) => {
    if (!req.params.apiKey || req.params.apiKey !== apiKey) {
        console.log(`Unauthorized access: no API Key from ${req.ip}`);
        res.status(401).send("Unauthorized: API Key missing!");
    }

    const wikiClient = Container.get(WikiClient);

    wikiClient.getAllPagesWithWarnings()
        .then((wikiProps) => {
            const warnings = wikiProps.map(prop => {return {pageId: prop.pageid, warnings: prop.warnings.warnings}});
            res.status(200).send(JSON.stringify({status: "success", warnings: JSON.stringify(warnings) || ""}));
        })
        .catch((e) => {
            console.error(e);
            res.status(500).send(JSON.stringify({status: e.message}));
        })
});


export {router as WikiSyncController};