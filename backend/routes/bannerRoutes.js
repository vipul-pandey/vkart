import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Banner from '../models/bannerModel.js';
import { isAuth, isAdmin } from '../utils.js';

const bannerRouter = express.Router();

bannerRouter.get('/', async (req, res) => {
  const { query } = req;
  const page = Number(query.page) || 1;
  const PAGE_SIZE = 5;
  const pageSize = Number(query.pageSize) || PAGE_SIZE;

  const banners = await Banner.find()
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  const countBanners = await Banner.countDocuments();
  res.send({
    banners,
    countBanners,
    page,
    pages: Math.ceil(countBanners / pageSize),
  });
});

bannerRouter.get('/:id', async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (banner) {
    res.send(banner);
  } else {
    res.status(404).send({ message: 'Banner Not Found' });
  }
});

bannerRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newBanner = new Banner(req.body);
    const banner = await newBanner.save();
    res.send({ message: 'Banner Created', banner });
  })
);

bannerRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const bannerId = req.params.id;
    const banner = await Banner.findById(bannerId);
    if (banner) {
      banner.title = req.body.title || banner.title;
      banner.subtitle = req.body.subtitle || banner.subtitle;
      // Accept nested objects (preferred) or flat fields
      if (req.body.label) {
        banner.label = req.body.label;
      } else if (req.body.labelText || req.body.labelColor) {
        banner.label = { text: req.body.labelText || (banner.label && banner.label.text), color: req.body.labelColor || (banner.label && banner.label.color) };
      }
      if (req.body.cta) {
        banner.cta = req.body.cta;
      } else if (req.body.ctaText || req.body.ctaLink) {
        banner.cta = { text: req.body.ctaText || (banner.cta && banner.cta.text), link: req.body.ctaLink || (banner.cta && banner.cta.link) };
      }
      banner.image = req.body.image || banner.image;
      if (Array.isArray(req.body.images)) banner.images = req.body.images;
      banner.isActive = typeof req.body.isActive === 'boolean' ? req.body.isActive : banner.isActive;
      const updated = await banner.save();
      res.send({ message: 'Banner Updated', banner: updated });
    } else {
      res.status(404).send({ message: 'Banner Not Found' });
    }
  })
);

bannerRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);
    if (banner) {
      await banner.remove();
      res.send({ message: 'Banner Deleted' });
    } else {
      res.status(404).send({ message: 'Banner Not Found' });
    }
  })
);

export default bannerRouter;