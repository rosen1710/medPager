import { route, prefix, layout } from "@react-router/dev/routes";

export default[
    layout("Header.jsx", [
        ...prefix("/home", [
            route("/nurse", "HomeNurse.jsx"),
            route("/doctor/:id", "HomeDoctor.jsx")
        ])
    ]),
    route("", "Start.jsx")
]