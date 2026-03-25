const moongoose = require("mongoose");

const categorySchema = new moongoose.Schema(
  {
    category_name: {
      type: String,
      required: [true, "category ta chaiyo ni kun kun items k ma parxa"],
      trim: true,
    },
     store_id:{
        type:moongoose.Schema.Types.ObjectId,
        ref:'Store',
        required:true,
     },

    description: String,
    image: String,
  },

  
  { timestamps: true },
);

categorySchema.index({category_name:1, store_id:1}, {unique: true})

module.exports = moongoose.model("Category", categorySchema);
