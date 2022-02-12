import AWS from "aws-sdk";
export const doesCombinationExists = async (combination: string) => {
  const Bucket = process.env.AWS_BUCKET_NAME || "";
  const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

  return new Promise<string>((resolve) => {
    s3.getObject(
      {
        Bucket,
        Key: combination + ".jpg",
      },
      (err, data) => {
        if (err) {
          console.log("err: ", err);
          resolve("");
        } else {
          const url = `https://${Bucket}.s3.amazonaws.com/${combination}.jpg`;

          console.log("data: ", data);
          resolve(url);
        }
      }
    );
  });
};
