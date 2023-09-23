use rocket::{fs::{Options, FileServer}, serde::json::Json, get, routes};



#[get("/songs")]
fn songs() -> Json<Vec<(String, String)>>{
    let mut vec = Vec::new();
    let v = std::fs::read_dir("./static/songs").unwrap();
    for entry in v.flatten(){
        let path = entry.path();
        let fileName = path.file_name().unwrap().to_str().unwrap();
        let name = path.file_stem().unwrap().to_str().unwrap();
        vec.push((fileName.into(), name.into()));
    }

    Json(vec)
}

#[rocket::launch]
fn rocket() -> _ {
    rocket::build()
    .mount("/", routes![songs])
    .mount(
        "/",
        FileServer::new(
            "./static",
            Options::DotFiles | Options::Index | Options::IndexFile,
        ),
    )
}
