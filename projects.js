const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../../data/projects.json");

exports.handler = async (event) => {
  const method = event.httpMethod;

  if (method === "GET") {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    return { statusCode: 200, body: JSON.stringify(data) };
  }

  if (method === "POST") {
    const body = JSON.parse(event.body);
    const list = JSON.parse(fs.readFileSync(dataPath, "utf8"));

    const newProject = { id: list.length ? Math.max(...list.map(p=>p.id)) + 1 : 1, ...body };

    list.push(newProject);
    fs.writeFileSync(dataPath, JSON.stringify(list, null, 2));

    return { statusCode: 200, body: JSON.stringify(newProject) };
  }

  if (method === "DELETE") {
    const { id } = JSON.parse(event.body);
    let list = JSON.parse(fs.readFileSync(dataPath, "utf8"));

    list = list.filter(p => p.id !== id);
    fs.writeFileSync(dataPath, JSON.stringify(list, null, 2));

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }

  return { statusCode: 405, body: "Not allowed" };
};
