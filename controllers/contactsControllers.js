import contactsService from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const contactById = await contactsService.getContactById(id);
    if (!contactById) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contactById);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const removeContact = await contactsService.removeContact(id);
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
    const { name, email, phone } = req.body;
    const newContact = await contactsService.addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res) => {
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
    const { name, email, phone } = req.body;
    const updateContact = await contactsService.updateContact(
      id,
      name,
      email,
      phone
    );
    if (!updateContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updateContact);
  } catch (error) {
    next(error);
  }
};
