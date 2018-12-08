/*
 *
 *
 */
Admin = function () {
    this.router = require('express').Router();
    this.path = '/admin';
    this.service = require('../service/service')
    this.convert = require('../utils/convert')

    // for test
    this.print = function (res) {
        console.log('!!!!!!!!!!!!!!!!!!!!! ' + res.tpldict.aaa)
    }

    this.regist = function () {

        this.router.get('/tag', function (req, res) {
            var param = {}
            param.navex = (req.cookies.navex == null) ? 'true' : req.cookies.navex
            param.page = admin.convert.int(req.query.page, 1)
            param.limit = admin.convert.int(req.query.limit, 10)
            // todo for test
            admin.print(res)
            admin.service.get_menu_item(param)
                .then(function (param) {
                    res.render('admin/tag.html', param)
                })
                .catch(function (reason) {
                    res.end('<p>' + reason + '</p>')
                })
        })

        this.router.get('/tag/data', function (req, res) {
            var param = {}
            param.page = admin.convert.int(req.query.page, 1)
            param.limit = admin.convert.int(req.query.limit, 10)
            admin.service.get_tag_count(param)
                .then(admin.service.get_tag_list)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = 'success'
                    json.count = param.total
                    json.data = param.tags
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = reason
                    res.json(json)
                })
        })

        this.router.post('/tag/update', function (req, res) {
            var param = {}
            param.id = req.body.id
            param.name = req.body.name.trim()
            admin.service.update_tag(param)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '修改成功'
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '修改失败，请稍后再试：' + reason
                    res.json(json)

                })
        })

        this.router.post('/tag/add', function (req, res) {
            var param = {}
            param.name = req.body.name.trim()
            admin.service.insert_tag(param)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '添加成功'
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '添加失败，请确认标签是否有重复：' + reason
                    res.json(json)

                })
        })

        this.router.post('/tag/del', function (req, res) {
            var param = {}
            param.id = req.body.id
            admin.service.del_tag(param)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '删除成功'
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '删除失败，请稍后再试：' + reason
                    res.json(json)

                })
        })

        // ==========================================================

        this.router.get('/access', function (req, res) {
            var param = {}
            param.navex = (req.cookies.navex == null) ? 'true' : req.cookies.navex
            param.page = admin.convert.int(req.query.page, 1)
            param.limit = admin.convert.int(req.query.limit, 10)
            admin.service.get_menu_item(param)
                .then(function (param) {
                    res.render('admin/access.html', param)
                })
                .catch(function (reason) {
                    res.end('<p>' + reason + '</p>')
                })
        })

        this.router.get('/access/data', function (req, res) {
            var param = {}
            param.page = admin.convert.int(req.query.page, 1)
            param.limit = admin.convert.int(req.query.limit, 10)
            admin.service.get_access_count(param)
                .then(admin.service.get_access_list)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = 'success'
                    json.count = param.total
                    json.data = param.list
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = reason
                    res.json(json)
                })
        })

        this.router.post('/access/update', function (req, res) {
            var param = {}
            param.id = req.body.id
            param.access = req.body.access.trim()
            param.name = req.body.name.trim()
            console.log('param: ' + JSON.stringify(param))
            admin.service.update_access(param)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '修改成功'
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '修改失败，请稍后再试：' + reason
                    res.json(json)

                })
        })

        this.router.post('/access/add', function (req, res) {
            var param = {}
            param.access = req.body.access.trim()
            param.name = req.body.name.trim()
            admin.service.insert_access(param)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '添加成功'
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '添加失败，请确认权限是否有重复：' + reason
                    res.json(json)

                })
        })

        this.router.post('/access/del', function (req, res) {
            var param = {}
            param.id = req.body.id
            admin.service.del_access(param)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '删除成功'
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '删除失败，请稍后再试：' + reason
                    res.json(json)

                })
        })


        // ==========================================================


        this.router.get('/menu', function (req, res) {
            var param = {}
            param.navex = (req.cookies.navex == null) ? 'true' : req.cookies.navex
            param.page = admin.convert.int(req.query.page, 1)
            param.limit = admin.convert.int(req.query.limit, 10)
            // todo for test
            admin.print(res)
            admin.service.get_menu_item(param)
                .then(function (param) {
                    res.render('admin/menu.html', param)
                })
                .catch(function (reason) {
                    res.end('<p>' + reason + '</p>')
                })
        })

        this.router.get('/menu/data', function (req, res) {
            var param = {}
            param.page = admin.convert.int(req.query.page, 1)
            param.limit = admin.convert.int(req.query.limit, 10)
            admin.service.get_menu_count(param)
                .then(admin.service.get_menu_list)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = 'success'
                    json.count = param.total
                    json.data = param.menus
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = reason
                    res.json(json)
                })
        })

        this.router.post('/menu/update', function (req, res) {
            var param = {}
            param.id = req.body.id
            param.name = req.body.name.trim()
            param.order = req.body.order.trim()
            param.access = req.body.access.trim()
            param.logo = req.body.logo.trim()
            param.url = req.body.url.trim()
            admin.service.update_menu(param)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '修改成功'
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '修改失败，请稍后再试：' + reason
                    res.json(json)

                })
        })

        this.router.post('/menu/add', function (req, res) {
            var param = {}
            param.name = req.body.name.trim()
            param.order = req.body.order.trim()
            param.access = req.body.access.trim()
            param.logo = req.body.logo.trim()
            param.url = req.body.url.trim()
            admin.service.insert_menu(param)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '添加成功'
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '添加失败，请稍后再试：' + reason
                    res.json(json)

                })
        })

        this.router.post('/menu/del', function (req, res) {
            var param = {}
            param.id = req.body.id
            admin.service.del_menu(param)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '删除成功'
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '删除失败，请稍后再试：' + reason
                    res.json(json)

                })
        })


        // ==========================================================

        this.router.get('/role', function (req, res) {
            var param = {}
            param.navex = (req.cookies.navex == null) ? 'true' : req.cookies.navex
            param.page = admin.convert.int(req.query.page, 1)
            param.limit = admin.convert.int(req.query.limit, 10)
            // todo for test
            admin.print(res)
            admin.service.get_menu_item(param)
                .then(function (param) {
                    res.render('admin/role.html', param)
                })
                .catch(function (reason) {
                    res.end('<p>' + reason + '</p>')
                })
        })

        this.router.get('/role/data', function (req, res) {
            var param = {}
            param.page = admin.convert.int(req.query.page, 1)
            param.limit = admin.convert.int(req.query.limit, 10)
            admin.service.get_role_count(param)
                .then(admin.service.get_role_list)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = 'success'
                    json.count = param.total
                    json.data = param.roles
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = reason
                    res.json(json)
                })
        })

        this.router.post('/role/update', function (req, res) {
            var param = {}
            param.id = req.body.id
            param.name = req.body.name.trim()
            admin.service.update_role(param)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '修改成功'
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '修改失败，请稍后再试：' + reason
                    res.json(json)

                })
        })

        this.router.post('/role/add', function (req, res) {
            var param = {}
            param.name = req.body.name.trim()
            admin.service.insert_role(param)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '添加成功'
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '添加失败，请确认标签是否有重复：' + reason
                    res.json(json)

                })
        })

        this.router.post('/role/del', function (req, res) {
            var param = {}
            param.id = req.body.id
            admin.service.del_role(param)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '删除成功'
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '删除失败，请稍后再试：' + reason
                    res.json(json)

                })
        })


        // ==========================================================

        this.router.get('/article', function (req, res) {
            var param = {}
            param.navex = (req.cookies.navex == null) ? 'true' : req.cookies.navex
            param.page = admin.convert.int(req.query.page, 1)
            param.limit = admin.convert.int(req.query.limit, 10)
            // todo for test
            admin.print(res)
            admin.service.get_menu_item(param)
                .then(function (param) {
                    res.render('admin/article.html', param)
                })
                .catch(function (reason) {
                    res.end('<p>' + reason + '</p>')
                })
        })

        this.router.get('/article/data', function (req, res) {
            var param = {}
            param.page = admin.convert.int(req.query.page, 1)
            param.limit = admin.convert.int(req.query.limit, 10)
            admin.service.get_article_count(param)
                .then(admin.service.get_article_list)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = 'success'
                    json.count = param.total
                    json.data = param.articles
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = reason
                    res.json(json)
                })
        })

        this.router.post('/article/update', function (req, res) {
            var param = {}
            param.id = req.body.id
            param.title = req.body.title.trim()
            param.summary = req.body.summary.trim()
            param.status = req.body.status.trim()
            param.body = req.body.body.trim()
            admin.service.update_article(param)
                .then(admin.service.update_article_body)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '修改成功'
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '修改失败，请稍后再试：' + reason
                    res.json(json)
                })
        })

        this.router.post('/article/add', function (req, res) {
            var param = {}
            param.title = req.body.title.trim()
            param.summary = req.body.summary.trim()
            param.status = req.body.status.trim()
            param.body = req.body.body.trim()
            admin.service.insert_article(param)
                .then(admin.service.update_article_body)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '添加成功'
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '添加失败，请确认标签是否有重复：' + reason
                    res.json(json)

                })
        })

        this.router.post('/article/del', function (req, res) {
            var param = {}
            param.id = req.body.id
            admin.service.del_article(param)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '删除成功'
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '删除失败，请稍后再试：' + reason
                    res.json(json)

                })
        })

        this.router.post('/article/body/update', function (req, res) {
            var param = {}
            param.id = admin.convert.int(req.body.id, 0)
            param.body = req.body.body
            admin.service.update_article_body(param)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '操作成功'
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '操作失败：' + reason
                    res.json(json)

                })
        })

        this.router.get('/article/body/:id', function (req, res) {
            var param = {}
            param.id = admin.convert.int(req.params.id, 0)
            admin.service.get_article_body(param)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '操作成功'
                    json.data = param.data
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '操作失败：' + reason
                    res.json(json)

                })
        })
        
        // ==========================================================

        this.router.get('/user', function (req, res) {
            var param = {}
            param.navex = (req.cookies.navex == null) ? 'true' : req.cookies.navex
            // todo for test
            admin.print(res)
            admin.service.get_menu_item(param)
                .then(admin.service.get_allroles)
                .then(function (param) {
                    res.render('admin/user.html', param)
                })
                .catch(function (reason) {
                    res.end('<p>' + reason + '</p>')
                })
        })

        this.router.get('/user/data', function (req, res) {
            var param = {}
            param.page = admin.convert.int(req.query.page, 1)
            param.limit = admin.convert.int(req.query.limit, 10)
            admin.service.get_user_count(param)
                .then(admin.service.get_user_list)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = 'success'
                    json.count = param.total
                    json.data = param.users
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = reason
                    res.json(json)
                })
        })

        this.router.post('/user/update', function (req, res) {
            var param = {}
            param.id = req.body.id
            param.role = admin.convert.int(req.body.role, 0)
            param.name = req.body.name.trim()
            admin.service.update_user(param)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '修改成功'
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '修改失败，请稍后再试：' + reason
                    res.json(json)

                })
        })

        this.router.post('/user/add', function (req, res) {
            var param = {}
            param.role = admin.convert.int(req.body.role, 0)
            param.name = req.body.name.trim()
            admin.service.insert_user(param)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '添加成功'
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '添加失败，请确认标签是否有重复：' + reason
                    res.json(json)

                })
        })

        this.router.post('/user/del', function (req, res) {
            var param = {}
            param.id = req.body.id
            admin.service.del_user(param)
                .then(function (param) {
                    var json = {}
                    json.code = 0
                    json.msg = '删除成功'
                    res.json(json)
                })
                .catch(function (reason) {
                    var json = {}
                    json.code = 1
                    json.msg = '删除失败，请稍后再试：' + reason
                    res.json(json)

                })
        })


    }
}

var admin = new Admin()
module.exports = admin
