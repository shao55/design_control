import React from "react";
import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Chip,
    Box,
} from "@mui/material";

const ProjectCard = ({ project }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{project.name}</Typography>
                <Box display="flex" justifyContent="space-between" my={1}>
                    <Chip label={project.category} />
                    <Typography variant="subtitle1">
                        Save Date: {project.saveDate}
                    </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                    Customer: {project.customer}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Management: {project.management}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Design Organization: {project.designOrganization}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Curator: {project.curator}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">View Details</Button>
            </CardActions>
        </Card>
    );
};

export default ProjectCard;
