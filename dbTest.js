const db = require('./models')

db.category.create({
  name: 'node'
}).then((createdCategory) => {
  db.project.findAll().then((projects) => {
    projects[0].addCategory(createdCategory)
    projects[1].addCategory(createdCategory)
  })
})

db.category.findOne().then((cat) => {
  cat.getProjects().then((projects) => {
    console.log(projects);
  })
})

db.category.findOrCreate({
  where: {
    name: 'html'
  }
}).then((cat) => {
  db.project.findOne({
    where: {
      id: 1
    }
  }).then((project) => {
    cat[0].addProject(project)
  })
})

db.project.findOne({
  where: {
    id: 1
  }
}).then((project) => {
  project.getCategories().then((cats) => {
    console.log(cats);
  })
})

