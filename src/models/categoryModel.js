import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category is required"],
      unique: [true, "category must be unique"],
      minLength: [3, "category name's too short"],
      maxLength: [32, "category name's too long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

categorySchema.post("init", (doc) => {
  setImageURL(doc);
});

categorySchema.post("save", (doc) => {
  setImageURL(doc);
});

export default mongoose.model("Category", categorySchema);
