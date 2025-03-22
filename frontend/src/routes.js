import { route, prefix, layout } from "@react-router/dev/routes";

export default[
    layout("Header.jsx", [
        ...prefix("", [
            route("/nurse", "HomeNurse.jsx"),
            route("/doctor/:id", "HomeDoctor.jsx")
        ])
    ]),
    route("", "Start.jsx")
]