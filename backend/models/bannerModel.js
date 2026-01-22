import mongoose from 'mongoose';

const labelSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    color: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ctaSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    link: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    subtitle: { type: String },
    label: labelSchema,
    image: { type: String, required: true },
    images: [String],
    cta: ctaSchema,
    isActive: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
