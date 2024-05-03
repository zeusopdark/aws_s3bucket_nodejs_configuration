import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const getObjectUrl = async (key) => {

    const accessKey = process.env.AWS_ACCESS_KEY
    const secretKey = process.env.AWS_SECRET_KEY
    const s3Client = new S3Client({
        region: process.env.AWS_BUCKET_REGION,
        credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretKey
        }
    })

    const command = new GetObjectCommand({
        Bucket: "ankit-practise-nodejs-bucket",
        Key: key
    });
    const url = await getSignedUrl(s3Client, command);
    return url;
}


export const putObjectUrl = async (key, contentType) => {
    const accessKey = process.env.AWS_ACCESS_KEY
    const secretKey = process.env.AWS_SECRET_KEY
    const s3Client = new S3Client({
        region: process.env.AWS_BUCKET_REGION,
        credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretKey
        }
    })

    const command = new PutObjectCommand({
        Bucket: "ankit-practise-nodejs-bucket",
        Key: key,
        ContentType: contentType
    });
    const url = await getSignedUrl(s3Client, command);
    return url;
}
// async function init() {
//     console.log("URL for ankitnishad image is ", await getObjectUrl(""))
// }
// init();