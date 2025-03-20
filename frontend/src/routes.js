import { route, prefix, layout } from "@react-router/dev/routes";

export default[
    layout("Header.jsx", [
        ...prefix("/home", [
            route("/nurse", "HomeNurse.jsx"),
            route("/doctor", "HomeDoctor.jsx")
        ]),
        route("", "Start.jsx")
    ])
]