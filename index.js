const express = require('express');
const axios = require('axios');
const app = express();
require("dotenv").config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

const HUBSPOT_BASE_URI ='https://api.hubspot.com/crm/v3';
const PORT = 3000;

const baseURI = `http://localhost:${PORT}`;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get("/", async (_req, res) => {
    const customObject =
        `${HUBSPOT_BASE_URI}/objects/peluches?properties=name,color,type`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        "Content-Type": "application/json",
    };
    try {
        const resp = await axios.get(customObject, { headers });
        const data = resp.data.results;
        res.render("homepage", { baseURI: baseURI + "/update-cobj", data });
    } catch (e) {
        console.error('----Error on Get Properties----', {error: e?.message, message: e?.response?.data?.message});
        res.render("error");
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get("/update-cobj", async (_req, res) => {
    try {
        res.render("update", { baseURI: baseURI + "/update-cobj" });
    } catch (e) {
        console.error('----Error on update display----', {error: e?.message, message: e?.response?.data?.message});
        res.render("error");
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post("/update-cobj", async (req, res) => {
    const updateProp = {
        properties: {
            name: req?.body?.name ?? '',
            color: req?.body?.color ?? '',
            type: req?.body?.type ?? '',
        },
    };
    const updateCustomObject = `${HUBSPOT_BASE_URI}/objects/peluches`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        "Content-Type": "application/json",
    };
    try {
        await axios.post(updateCustomObject, updateProp, { headers });
        res.redirect("/");
    } catch (e) {
        console.error('----Error on Create Custom Objects with Valid Input Values----', {error: e?.message});
        res.redirect("/");
    }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));