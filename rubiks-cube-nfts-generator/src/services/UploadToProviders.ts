import AWS from "aws-sdk";
import fs from "fs";
import path from "path";

AWS.config.update({ region: "us-east-1" });
export default class UploadToProviders {
  static async execute(fileDir: string) {
    return new Promise<string>((resolve, reject) => {
      const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

      const bucket = process.env.AWS_BUCKET_NAME || "";

      const fileStream = fs.createReadStream(fileDir);
      fileStream.on("error", function (err) {
        console.error(err);
        reject(new Error("Couldn't create file stream: " + err.message));
      });

      const uploadParams = {
        Bucket: bucket,
        Key: path.basename(fileDir),
        Body: fileStream,
      };

      s3.upload(uploadParams, (err: any, data: any) => {
        if (err) {
          console.error(err);
          return reject(new Error("Couldn't upload to S3: " + err.message));
        }
        if (data) {
          const url = `https://${bucket}.s3.amazonaws.com/${uploadParams.Key}`;
          fs.unlink(fileDir, console.log);
          return resolve(url);
        }
      });
    });
  }
}
