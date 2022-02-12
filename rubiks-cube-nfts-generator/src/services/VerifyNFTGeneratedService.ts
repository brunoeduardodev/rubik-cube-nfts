import axios from "axios";

export default class VerifyNFTGeneratedService {
  static async execute(nftCombination: string) {
    // https://rubiks-cube-nft.s3.amazonaws.com/2ec8cecefd60beedd34b122704e6d252-430441423078916020502143411350635172016361636.jpg

    const bucket = process.env.AWS_BUCKET_NAME || "";
    const NFT_PATH = `https://${bucket}/${nftCombination}`;

    try {
      await axios.get(NFT_PATH, { timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }
}
