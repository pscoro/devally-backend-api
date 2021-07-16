import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import logging from '../../../config/logging';
import project from './../models/project';
import user from './../models/user';

const NAMESPACE = 'PROJECT';

const createProject = (req: Request, res: Response, next: NextFunction) => {
    let { userEmail, images, title, description, tags, positions } = req.body;
    console.log(userEmail);
    user.findOne({ email: userEmail }, (err, doc) => {
        if (err || !doc) {
            logging.error(NAMESPACE, 'User from jwt not found', err);
            return res.status(500).json({ err: err });
        }

        project
            .create({
                _id: new mongoose.Types.ObjectId(),
                user: doc,
                images: images,
                title: title,
                description: description,
                tags: tags,
                positions: positions
            })
            .then((result) => {
                return res.status(201).json({
                    project: result
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
    });
};

const deleteProject = (req: Request, res: Response, next: NextFunction) => {};

const getProjectById = (req: Request, res: Response, next: NextFunction) => {
    console.log('HIHIHI');
    console.log(req.params);
    console.log(req.params.projectId);
    project.findById(req.params.projectId, (error, result) => {
        if (error) {
            logging.error(NAMESPACE, 'Project not found', error);
            return res.status(404).json({
                // might be a 500
                error: error
            });
        }
        if (!result) {
            logging.error(NAMESPACE, 'Project not found', error);
            return res.status(404).json({
                error: error
            });
        }
        return res.status(200).json({
            project: result
        });
    });
};

export default { createProject, deleteProject, getProjectById };
