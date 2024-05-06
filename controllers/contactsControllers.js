import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from "../schemas/contactsSchemas.js";
import Contact from "../model/contactsModel.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
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
      return res.status(404).json({ message: "Not found" });
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
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(removeContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const book = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      favorite: req.body.favorite,
    };
    const newContact = await Contact.create(book);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
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
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updateContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = updateStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const book = {
      favorite: req.body.favorite,
    };
    const contact = await Contact.findByIdAndUpdate(id, book, {
      new: true,
    });

    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};
