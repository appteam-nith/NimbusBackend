const Project = require('../models/project');
const Club = require('../models/club');
const User = require('../models/user');

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const { title, description, clubId, status, startDate, endDate, collaborators, imageUrl } = req.body;

        // Check if the club exists
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Check if the user has permission (admin or clubAdmin of this club)
        if (req.user.role !== 'admin' && 
            !(req.user.role === 'clubAdmin' && club.clubAdmin.toString() === req.user.userId)) {
            return res.status(403).json({ message: 'Unauthorized to create projects for this club' });
        }

        // Create the project
        const project = new Project({
            title,
            description,
            club: clubId,
            status: status || 'pending',
            startDate: startDate || Date.now(),
            endDate: endDate || null,
            collaborators: collaborators || [],
            imageUrl: imageUrl || null
        });

        await project.save();

        // Update the club's projects array
        club.projects.push(project._id);
        await club.save();

        res.status(201).json({
            message: 'Project created successfully',
            project: {
                id: project._id,
                title: project.title,
                description: project.description,
                clubId: project.club,
                clubName: club.name,
                status: project.status,
                startDate: project.startDate,
                imageUrl: project.imageUrl
            }
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

// Get all projects for a specific club
exports.getClubProjects = async (req, res) => {
    try {
        const { clubId } = req.params;

        // Check if the club exists
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Find all projects for this club
        const projects = await Project.find({ club: clubId })
            .populate('collaborators', 'name email rollNo')
            .sort({ createdAt: -1 });

        // Format the response with club name
        const formattedProjects = projects.map(project => {
            return {
                ...project.toObject(),
                clubName: club.name
            };
        });

        res.status(200).json({ 
            clubName: club.name,
            clubDescription: club.description,
            clubImage: club.image,
            projects: formattedProjects 
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
};

// Get a specific project by ID
exports.getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId)
            .populate('collaborators', 'name email rollNo')
            .populate('club', 'name description image');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Format the response to highlight club name
        const formattedProject = {
            ...project.toObject(),
            clubName: project.club.name,
            clubImage: project.club.image
        };

        res.status(200).json({ project: formattedProject });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Error fetching project', error: error.message });
    }
};

// Update a project
exports.updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const updates = req.body;

        // Find the project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if the user has permission (admin or clubAdmin of this club)
        const club = await Club.findById(project.club);
        if (!club) {
            return res.status(404).json({ message: 'Associated club not found' });
        }

        if (req.user.role !== 'admin' && 
            !(req.user.role === 'clubAdmin' && club.clubAdmin.toString() === req.user.userId)) {
            return res.status(403).json({ message: 'Unauthorized to update this project' });
        }

        // Update the project
        Object.keys(updates).forEach(key => {
            if (key !== '_id' && key !== 'club') { // Don't allow changing the club or ID
                project[key] = updates[key];
            }
        });

        await project.save();

        // Format the response to include club name
        const updatedProject = {
            ...project.toObject(),
            clubName: club.name,
            clubImage: club.image
        };

        res.status(200).json({
            message: 'Project updated successfully',
            project: updatedProject
        });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
};

// Delete a project
exports.deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Find the project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if the user has permission (admin or clubAdmin of this club)
        const club = await Club.findById(project.club);
        if (req.user.role !== 'admin' && 
            !(req.user.role === 'clubAdmin' && club.clubAdmin.toString() === req.user.userId)) {
            return res.status(403).json({ message: 'Unauthorized to delete this project' });
        }

        await Project.findByIdAndDelete(projectId);

        res.status(200).json({
            message: 'Project deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
};

// Get all projects (admin only)
exports.getAllProjects = async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.user.role !== 'admin' && req.user.role !== 'clubAdmin') {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        // If user is clubAdmin, only return projects for their clubs
        let query = {};
        if (req.user.role === 'clubAdmin') {
            // Find clubs where this user is the admin
            const adminClubs = await Club.find({ clubAdmin: req.user.userId });
            if (adminClubs.length === 0) {
                return res.status(200).json({ projects: [] });
            }
            
            const clubIds = adminClubs.map(club => club._id);
            query = { club: { $in: clubIds } };
        }

        const projects = await Project.find(query)
            .populate('club', 'name description image')
            .populate('collaborators', 'name email rollNo')
            .sort({ createdAt: -1 });

        // Format projects to include club name prominently
        const formattedProjects = projects.map(project => {
            return {
                ...project.toObject(),
                clubName: project.club.name,
                clubImage: project.club.image
            };
        });

        res.status(200).json({ projects: formattedProjects });
    } catch (error) {
        console.error('Error fetching all projects:', error);
        res.status(500).json({ message: 'Error fetching all projects', error: error.message });
    }
}; 