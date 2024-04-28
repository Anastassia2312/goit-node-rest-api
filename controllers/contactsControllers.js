import contactsService from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import { randomUUID } from "crypto";

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

export const createContact = async (req, res) => {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };
    const { error } = createContactSchema.validate(contact, {
      convert: false,
    });
    if (typeof error !== undefined) {
      return res.status(400).json({ message: error.message });
    }
    const { name, email, phone } = req.body;
    const createContact = await contactsService.addContact(name, email, phone);
    res.status(201).json({ id: randomUUID(), ...createContact });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res) => {
  try {
    const contact = JSON.stringify(req.body);
    if (contact === null) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }
    const { error } = updateContactSchema.validate(contact);
    if (error !== undefined) {
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
