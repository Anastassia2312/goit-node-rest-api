import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from "../schemas/contactsSchemas.js";
import Contact from "../model/contactsModel.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const contacts = await Contact.find({ owner: req.user._id })
      .skip(skip)
      .limit(limit);
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contactById = await Contact.findById(id);
    if (!contactById) {
      throw HttpError(404, { message: "Not found" });
    }
    res.status(200).json(contactById);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removeContact = await Contact.findByIdAndDelete(id);
    if (!removeContact) {
      throw HttpError(404, { message: "Not found" });
    }
    res.status(200).json(removeContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { name, email, phone, favorite } = req.body;
    const newContact = await Contact.create({
      name,
      email,
      phone,
      favorite,
      owner,
    });
    console.log(newContact);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }
    const { id } = req.params;
    const { name, email, phone, favorite } = req.body;
    const contact = {
      name: name,
      email: email,
      phone: phone,
      favorite: favorite,
    };
    const updateContact = await Contact.findByIdAndUpdate(id, contact, {
      new: true,
    });
    if (!updateContact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(updateContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = {
      favorite: req.body.favorite,
    };
    const contact = await Contact.findByIdAndUpdate(id, book, {
      new: true,
    });

    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};
