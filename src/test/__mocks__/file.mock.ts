import { PassThrough } from "stream";

export const fileMock: Express.Multer.File = {
    fieldname: "file",
    originalname: "avatar.mock.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",
    size: 1024,
    destination: "",
    filename: "",
    path: "",
    buffer: Buffer.from("mock file data"),
    stream: new PassThrough(),
};
