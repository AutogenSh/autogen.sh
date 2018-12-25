/*
 * admin
 *
 */
var adminService = require('../service/admin_service');
var router = require('express').Router();
var convert = require('../util/convert');
var bcrypt = require('bcryptjs');
var svgCaptcha = require('svg-captcha');

module.exports = (function () {

    var loginFilter = function (req, res, next) {
        if (req.session.user.id == 10001) {
            res.redirect('/admin/login');
        } else {
            next();
        }
    };

    router.get('/captcha', function (req, res) {
        var captcha = svgCaptcha.create({
            charPreset: 'abcdefghkqxyzABCDEFGHKMNPQRSTUVWXYZ0123456789',
            fontSize: 41,
            noise: 2,
            width: 120,
            height: 40,
        });
        req.session.captcha = captcha.text.toLowerCase();
        res.type('svg');
        res.send(captcha.data);
    });

    router.get('/login', function (req, res) {
        res.render('admin/login.html', req);
    });

    router.post('/login', function (req, res, next) {
        req.name = req.body.name || '';
        req.pwd = req.body.pwd || '';
        req.vercode = req.body.vercode || '';

        (req => new Promise((resolve, reject) => {
            // verify vercode
            req.result = {};
            if (req.vercode.toLowerCase() == req.session.captcha) {
                resolve(req);
            } else {
                req.result.code = 1;
                req.result.msg = '登陆失败, 验证码错误';
                reject(req);
            }
        }))(req)
            .then(adminService.getUserByName)
            .then(req => new Promise((resolve, reject) => {
                if (req.user == null) {
                    // username error
                    req.result.code = 1;
                    req.result.msg = '登陆失败, 用户名或者密码错误';
                    reject(req);
                } else {
                    resolve(req);
                }
            }))
            .then(req => new Promise((resolve, reject) => { req.id = req.user.role; resolve(req) }))
            .then(adminService.getAccessByRole)
            .then(req => new Promise((resolve, reject) => {
                req.user.access = [];
                req.accesses.forEach(element => {
                    req.user.access.push(element.access)
                });

                if (bcrypt.compareSync(req.pwd, req.user.pwd)) {
                    resolve(req);
                } else {
                    // password error
                    req.result.code = 1;
                    req.result.msg = '登陆失败, 用户名或者密码错误';
                    reject(req);
                }
            }))
            .then((req) => {
                req.result.code = 0;
                req.result.msg = '登陆成功';
                req.session.user = req.user;
                res.json(req.result);
                // res.redirect('/admin/tag');
            })
            .catch(function (req) {
                res.json(req.result);
            });
    });

    router.use(loginFilter);

    router.get('/logout', function (req, res) {
        req.session.destroy(function() {
            res.redirect('/');
        });
    });

    router.get('/tag', function (req, res) {
        adminService.getMenu(req)
            .then(function (req) {
                res.render('admin/tag.html', req)
            })
            .catch(function (reason) {
                res.send('<p>' + reason + '</p>')
            })
    });

    router.get('/tag/data', function (req, res) {
        adminService.getTagCount(req)
            .then(adminService.getTagList)
            .then(function (req) {
                var json = {}
                json.code = 0
                json.msg = 'success'
                json.count = req.total
                json.data = req.tags
                res.json(json)
            })
            .catch(function (reason) {
                var json = {}
                json.code = 1
                json.msg = reason
                res.json(json)
            })
    })

    router.post('/tag/update', function (req, res) {
        req.id = convert.int(req.body.id, 0);
        req.name = req.body.name.trim()
        adminService.updateTag(req)
            .then(function (req) {
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

    router.post('/tag/add', function (req, res) {
        req.name = req.body.name.trim()
        adminService.insertTag(req)
            .then(function (req) {
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

    router.post('/tag/del', function (req, res) {
        req.id = convert.int(req.body.id, 0);
        adminService.deleteTag(req)
            .then(function (req) {
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

    router.get('/access', function (req, res) {
        adminService.getMenu(req)
            .then(function (req) {
                res.render('admin/access.html', req)
            })
            .catch(function (reason) {
                res.send('<p>' + reason + '</p>')
            })
    })

    router.get('/access/data', function (req, res) {
        adminService.getAccessCount(req)
            .then(adminService.getAccessList)
            .then(function (req) {
                var json = {}
                json.code = 0
                json.msg = 'success'
                json.count = req.total
                json.data = req.list
                res.json(json)
            })
            .catch(function (reason) {
                var json = {}
                json.code = 1
                json.msg = reason
                res.json(json)
            })
    })

    router.post('/access/update', function (req, res) {
        req.id = convert.int(req.body.id, 0);
        req.access = req.body.access.trim()
        req.name = req.body.name.trim()
        adminService.updateAccess(req)
            .then(function (req) {
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

    router.post('/access/add', function (req, res) {
        req.access = req.body.access.trim()
        req.name = req.body.name.trim()
        adminService.insertAccess(req)
            .then(function (req) {
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

    router.post('/access/del', function (req, res) {
        req.id = convert.int(req.body.id, 0);
        adminService.deleteAccess(req)
            .then(function (req) {
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


    router.get('/menu', function (req, res) {
        adminService.getMenu(req)
            .then(function (req) {
                res.render('admin/menu.html', req)
            })
            .catch(function (reason) {
                res.send('<p>' + reason + '</p>')
            })
    })

    router.get('/menu/data', function (req, res) {
        adminService.getMenuCount(req)
            .then(adminService.getMenuList)
            .then(function (req) {
                var json = {}
                json.code = 0
                json.msg = 'success'
                json.count = req.total
                json.data = req.menus
                res.json(json)
            })
            .catch(function (reason) {
                var json = {}
                json.code = 1
                json.msg = reason
                res.json(json)
            })
    })

    router.post('/menu/update', function (req, res) {
        req.id = convert.int(req.body.id, 0);
        req.name = req.body.name.trim()
        req.order = req.body.order.trim()
        req.access = req.body.access.trim()
        req.logo = req.body.logo.trim()
        req.url = req.body.url.trim()
        adminService.updateMenu(req)
            .then(function (req) {
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

    router.post('/menu/add', function (req, res) {
        req.name = req.body.name.trim()
        req.order = req.body.order.trim()
        req.access = req.body.access.trim()
        req.logo = req.body.logo.trim()
        req.url = req.body.url.trim()
        adminService.insertMenu(req)
            .then(function (req) {
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

    router.post('/menu/del', function (req, res) {
        req.id = convert.int(req.body.id, 0);
        adminService.deleteMenu(req)
            .then(function (req) {
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

    router.get('/role', function (req, res) {
        adminService.getMenu(req)
            .then(function (req) {
                res.render('admin/role.html', req)
            })
            .catch(function (reason) {
                res.send('<p>' + reason + '</p>')
            })
    })

    router.get('/role/data', function (req, res) {
        adminService.getRoleCount(req)
            .then(adminService.getRoleList)
            .then(function (req) {
                var json = {}
                json.code = 0
                json.msg = 'success'
                json.count = req.total
                json.data = req.roles
                res.json(json)
            })
            .catch(function (reason) {
                var json = {}
                json.code = 1
                json.msg = reason
                res.json(json)
            })
    })

    router.post('/role/update', function (req, res) {
        req.id = convert.int(req.body.id, 0);
        req.name = req.body.name.trim()
        adminService.updateRole(req)
            .then(function (req) {
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

    router.post('/role/add', function (req, res) {
        req.name = req.body.name.trim()
        adminService.insertRole(req)
            .then(function (req) {
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

    router.post('/role/del', function (req, res) {
        req.id = convert.int(req.body.id, 0);
        adminService.delRole(req)
            .then(function (req) {
                var json = {};
                json.code = 0;
                json.msg = '删除成功';
                res.json(json);
            })
            .catch(function (reason) {
                var json = {};
                json.code = 1;
                json.msg = '删除失败，请稍后再试：' + reason;
                res.json(json);

            })
    })

    // ==========================================================

    router.get('/article', function (req, res) {
        adminService.getMenu(req)
            .then(function (req) {
                res.render('admin/article.html', req)
            })
            .catch(function (reason) {
                res.send('<p>' + reason + '</p>')
            })
    })

    router.get('/article/data', function (req, res) {
        adminService.getArticleCount(req)
            .then(adminService.getArticleList)
            .then(function (req) {
                var json = {}
                json.code = 0
                json.msg = 'success'
                json.count = req.total
                json.data = req.articles
                res.json(json)
            })
            .catch(function (reason) {
                var json = {}
                json.code = 1
                json.msg = reason
                res.json(json)
            })
    })

    router.post('/article/update', function (req, res) {
        req.id = convert.int(req.body.id, 0);
        req.title = req.body.title.trim()
        req.summary = req.body.summary.trim()
        req.status = req.body.status.trim()
        req.body = req.body.body.trim()
        adminService.updateArticle(req)
            .then(adminService.updateArticleBody)
            .then(function (req) {
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

    router.post('/article/add', function (req, res) {
        req.title = req.body.title.trim()
        req.summary = req.body.summary.trim()
        req.status = req.body.status.trim()
        req.body = req.body.body.trim()
        adminService.insertArticle(req)
            .then(adminService.updateArticleBody)
            .then(function (req) {
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

    router.post('/article/del', function (req, res) {
        req.id = convert.int(req.body.id, 0);
        adminService.delArticle(req)
            .then(function (req) {
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

    router.post('/article/body/update', function (req, res) {
        req.id = convert.int(req.body.id, 0);
        req.body = req.body.body
        adminService.updateArticleBody(req)
            .then(function (req) {
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

    router.get('/article/body/:id', function (req, res) {
        req.id = convert.int(req.params.id, 0)
        adminService.getArticleBody(req)
            .then(function (req) {
                var json = {}
                json.code = 0
                json.msg = '操作成功'
                json.data = req.data
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

    router.get('/user', function (req, res) {
        adminService.getMenu(req)
            .then(adminService.getAllRoles)
            .then(function (req) {
                res.render('admin/user.html', req)
            })
            .catch(function (reason) {
                res.send('<p>' + reason + '</p>')
            })
    })

    router.get('/user/data', function (req, res) {
        adminService.getUserCount(req)
            .then(adminService.getUserList)
            .then(function (req) {
                var json = {}
                json.code = 0
                json.msg = 'success'
                json.count = req.total
                json.data = req.users
                res.json(json)
            })
            .catch(function (reason) {
                var json = {}
                json.code = 1
                json.msg = reason
                res.json(json)
            })
    })

    router.post('/user/update', function (req, res) {
        req.id = convert.int(req.body.id, 0);
        req.role = convert.int(req.body.role, 0);
        req.name = req.body.name.trim();
        adminService.updateUser(req)
            .then(function (req) {
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

    router.post('/user/add', function (req, res) {
        req.role = convert.int(req.body.role, 0)
        req.name = req.body.name.trim()
        adminService.insertUser(req)
            .then(function (req) {
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

    router.post('/user/del', function (req, res) {
        req.id = convert.int(req.body.id, 0);
        adminService.deleteUser(req)
            .then(function (req) {
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

    return {
        path: '/admin',
        router: router,
    };
})();

