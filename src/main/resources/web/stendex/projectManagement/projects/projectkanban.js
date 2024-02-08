function projectKanbanReorder(controller, elements) {
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].project.currentOrder !== i) {
            controller.changeProperty("currentOrder", elements[i].project, i);
        }
    }
}
function projectKanban() {
    return {
        render: function (element, controller) {
            let kanban = document.createElement("div")
            kanban.classList.add("project-kanban");

            element.appendChild(kanban);

            element.kanban = kanban;
        },
        update: function (element, controller, list, options) {
            if (element.drake)
                element.drake.destroy();
            element.drake = dragula();

            while (element.kanban.lastElementChild) {
                element.kanban.removeChild(element.kanban.lastElementChild);
            }

            if (!options || !options.statuses) return;

            for (const status of options.statuses) {
                let statusDiv = document.createElement("div")
                statusDiv.classList.add("project-kanban-status");
                if (status !== options.statuses[0])
                    statusDiv.classList.add("border-start");

                let statusHeader = document.createElement("div");
                statusHeader.classList.add("project-kanban-status-header");
                statusDiv.appendChild(statusHeader);
                if (status.color) {
                    statusHeader.style.background = status.color;
                }

                let statusName = document.createElement("div");
                statusName.classList.add("project-kanban-status-name");
                statusName.innerHTML = status.name;
                statusHeader.appendChild(statusName);

                let statusBody = document.createElement("div");
                statusBody.classList.add("project-kanban-status-body");

                for (const project of list)
                    if (project.status === status.id.toString()) {
                        let projectCard = document.createElement("div");
                        projectCard.classList.add("project-kanban-card");
                        projectCard.classList.add("card");

                        projectCard.addEventListener("click", function() {
                            controller.changeObject(project, true, projectCard);
                        });

                        // if (project.namePartner) {
                        //     let projectHeader = document.createElement("h5");
                        //     projectHeader.classList.add("project-kanban-card-header");
                        //     projectHeader.classList.add("card-header");
                        //     projectHeader.innerHTML = project.namePartner;
                        //     projectCard.appendChild(projectHeader);
                        // }

                        let projectContent = document.createElement("ul");
                        projectContent.classList.add("project-kanban-card-content");
                        projectContent.classList.add("list-group");
                        projectContent.classList.add("list-group-flush");
                        projectCard.appendChild(projectContent);

                        if (project.namePartner) {
                            let projectType = document.createElement("li");
                            projectType.classList.add("project-kanban-card-partner");
                            projectType.classList.add("list-group-item");
                            projectType.innerHTML = project.namePartner;
                            projectContent.appendChild(projectType);
                        }

                        if (project.budget) {
                            let projectType = document.createElement("li");
                            projectType.classList.add("project-kanban-card-budget");
                            projectType.classList.add("list-group-item");
                            projectType.innerHTML = project.budget;
                            projectContent.appendChild(projectType);
                        }

                        if (project.installDate) {
                            let projectType = document.createElement("li");
                            projectType.classList.add("project-kanban-card-install");
                            projectType.classList.add("list-group-item");
                            projectType.classList.add("small");
                            projectType.innerHTML = "<div class=\"text-secondary\">Дата монтажа</div>" + project.installDate;
                            projectContent.appendChild(projectType);
                        }
                        if (project.deinstallDate) {
                            let projectType = document.createElement("li");
                            projectType.classList.add("project-kanban-card-deinstall");
                            projectType.classList.add("list-group-item");
                            projectType.classList.add("small");
                            projectType.innerHTML = "<div class=\"text-secondary\">Дата демонтажа</div>" + project.deinstallDate;
                            projectContent.appendChild(projectType);
                        }
                        if (project.runDate) {
                            let projectType = document.createElement("li");
                            projectType.classList.add("project-kanban-card-run");
                            projectType.classList.add("list-group-item");
                            projectType.classList.add("small");
                            projectType.innerHTML = "<div class=\"text-secondary\">Дата проведения</div>" + project.runDate;
                            projectContent.appendChild(projectType);
                        }
                        if (project.nameExhibition) {
                            let projectType = document.createElement("li");
                            projectType.classList.add("project-kanban-card-exhibition");
                            projectType.classList.add("list-group-item");
                            projectType.innerHTML = project.nameExhibition;
                            projectContent.appendChild(projectType);
                        }
                        if (project.nameManager) {
                            let projectType = document.createElement("li");
                            projectType.classList.add("project-kanban-card-manager");
                            projectType.classList.add("list-group-item");
                            projectType.classList.add("small");
                            projectType.innerHTML = project.nameManager;
                            projectContent.appendChild(projectType);
                        }
                        // if (project.tags) {
                        //     let projectTags = document.createElement("li");
                        //     projectTags.classList.add("project-kanban-card-tags");
                        //     projectTags.classList.add("list-group-item");
                        //     for (const tag of project.tags) {
                        //         let projectTag = document.createElement("span");
                        //         projectTag.classList.add("project-kanban-card-tag");
                        //         projectTag.classList.add("badge");
                        //         projectTag.classList.add("rounded-pill");
                        //         projectTag.classList.add("text-bg-" + (tag.idColor ? tag.idColor : "secondary"));
                        //         projectTag.innerHTML = tag.name;
                        //         projectTags.appendChild(projectTag);
                        //     }
                        //     projectContent.appendChild(projectTags);
                        // }


                        projectCard.project = project;
                        statusBody.appendChild(projectCard);
                    }

                statusDiv.appendChild(statusBody);

                statusBody.status = status;
                element.drake.containers.push(statusBody);

                element.kanban.appendChild(statusDiv);
            }

            element.drake.on("drop", function(el, target, source, sibling) {
                if (el.project.status !== target.status.id.toString())
                    controller.changeProperty("status", el.project, target.status.id);
                projectKanbanReorder(controller, target.children);
            });

        },
        clear: function (element) {
            if (element.drake)
                element.drake.destroy();
        }
    }
}
