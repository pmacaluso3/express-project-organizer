let express = require('express')
let db = require('../models')
let router = express.Router()

// POST /projects - create a new project
router.post('/', (req, res) => {
  db.project.create({
    name: req.body.name,
    githubLink: req.body.githubLink,
    deployLink: req.body.deployedLink,
    description: req.body.description
  }).then((project) => {
    db.category.findOrCreate({
      where: {
        name: req.body.category
      }
    }).then((categoryReport) => {
      const category = categoryReport[0]
      category.addProject(project).then(() => {
        res.redirect('/')
      })
    })
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })

  // alternate version with async/await
  // async function temp() {
  //   try {
  //     const project = await db.project.create({
  //       name: req.body.name,
  //       githubLink: req.body.githubLink,
  //       deployLink: req.body.deployedLink,
  //       description: req.body.description
  //     })
  //     const category = await db.category.findOrCreate({
  //       where: {
  //         name: req.body.category 
  //       }
  //     })
  //     await category[0].addProject(project)
  //     res.redirect('/')
  //   } catch {
  //     res.status(400).render('main/404')
  //   }
  // }
  // temp()
})

// GET /projects/new - display form for creating a new project
router.get('/new', (req, res) => {
  res.render('projects/new')
})

// GET /projects/:id - display a specific project
router.get('/:id', (req, res) => {
  db.project.findOne({
    where: { id: req.params.id },
    include: [db.category]
  })
  .then((project) => {
    if (!project) throw Error()
    db.category.findAll().then((allCategories => {
      const otherCategories = allCategories.filter((cat) => {
        return !project.categories.map((c) => c.id).includes(cat.id)
      })
      
      console.log(otherCategories);

      res.render('projects/show', { project, otherCategories })
    }))
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

router.put('/:id', (req, res) => {
  db.project.findOne({
    where: { id: req.params.id }
  }).then((project) => {
    db.category.findOne({
      where: { id: req.body.categoryId }
    }).then((category) => {
      project.addCategory(category).then(() => {
        res.redirect(`/projects/${req.params.id}`)
      })
    })
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

module.exports = router
