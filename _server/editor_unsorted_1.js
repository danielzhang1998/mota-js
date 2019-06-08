editor_unsorted_1_wrapper=function(editor){

editor.constructor.prototype.listen=function () {
    document.body.onmousedown = function (e) {
        //console.log(e);
        var clickpath = [];
        var getpath=function(e) {
            var path = [];
            var currentElem = e.target;
            while (currentElem) {
                path.push(currentElem);
                currentElem = currentElem.parentElement;
            }
            if (path.indexOf(window) === -1 && path.indexOf(document) === -1)
                path.push(document);
            if (path.indexOf(window) === -1)
                path.push(window);
            return path;
        }
        getpath(e).forEach(function (node) {
            if (!node.getAttribute) return;
            var id_ = node.getAttribute('id');
            if (id_) {
                if (['left', 'left1', 'left2', 'left3', 'left4', 'left5', 'left8', 'mobileview'].indexOf(id_) !== -1) clickpath.push('edit');
                clickpath.push(id_);
            }
        });
    
        var unselect=true;
        for(var ii=0,thisId;thisId=['edit','tip','brushMod','brushMod2','brushMod3','layerMod','layerMod2','layerMod3','viewportButtons'][ii];ii++){
            if (clickpath.indexOf(thisId) !== -1){
                unselect=false;
                break;
            }
        }
        if (unselect) {
            if (clickpath.indexOf('eui') === -1) {
                if (selectBox.isSelected()) {
                    editor_mode.onmode('');
                    editor.file.saveFloorFile(function (err) {
                        if (err) {
                            printe(err);
                            throw(err)
                        }
                        ;printf('地图保存成功');
                    });
                }
                selectBox.isSelected(false);
                editor.info = {};
            }
        }
        //editor.mode.onmode('');
        if (e.button!=2 && !editor.isMobile){
            editor.hideMidMenu();
        }
        if (clickpath.indexOf('down') !== -1 && editor.isMobile && clickpath.indexOf('midMenu') === -1){
            editor.hideMidMenu();
        }
        if(clickpath.length>=2 && clickpath[0].indexOf('id_')===0){editor.lastClickId=clickpath[0]}
    }

    var eui=document.getElementById('eui');
    var uc = eui.getContext('2d');

    function fillPos(pos) {
        uc.fillStyle = '#' + ~~(Math.random() * 8) + ~~(Math.random() * 8) + ~~(Math.random() * 8);
        uc.fillRect(pos.x * 32 + 12 - core.bigmap.offsetX, pos.y * 32 + 12 - core.bigmap.offsetY, 8, 8);
    }//在格子内画一个随机色块

    function eToLoc(e) {
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        var xx=e.clientX,yy=e.clientY
        if(editor.isMobile){xx=e.touches[0].clientX,yy=e.touches[0].clientY}
        editor.loc = {
            'x': scrollLeft + xx - mid.offsetLeft - mapEdit.offsetLeft,
            'y': scrollTop + yy - mid.offsetTop - mapEdit.offsetTop,
            'size': editor.isMobile?(32*innerWidth*0.96/core.__PIXELS__):32
        };
        return editor.loc;
    }//返回可用的组件内坐标

    function locToPos(loc, addViewportOffset) {
        var offsetX=0, offsetY=0;
        if (addViewportOffset){
            offsetX=core.bigmap.offsetX/32;
            offsetY=core.bigmap.offsetY/32;
        }
        editor.pos = {'x': ~~(loc.x / loc.size)+offsetX, 'y': ~~(loc.y / loc.size)+offsetY}
        return editor.pos;
    }

    var holdingPath = 0;
    var stepPostfix = null;//用于存放寻路检测的第一个点之后的后续移动

    var mouseOutCheck = 2;

    function clear1() {
        if (mouseOutCheck > 1) {
            mouseOutCheck--;
            setTimeout(clear1, 1000);
            return;
        }
        holdingPath = 0;
        stepPostfix = [];
        uc.clearRect(0, 0, core.__PIXELS__, core.__PIXELS__);
        startPos = endPos = null;
    }//用于鼠标移出canvas时的自动清除状态

    eui.oncontextmenu=function(e){e.preventDefault()}

    eui.ondblclick = function(e) {
        // 双击地图可以选中素材
        var loc = eToLoc(e);
        var pos = locToPos(loc,true);
        editor.setSelectBoxFromInfo(editor[editor.layerMod][pos.y][pos.x]);
        return;
    }

    var startPos=null, endPos=null;
    eui.onmousedown = function (e) {
        if (e.button==2){
            var loc = eToLoc(e);
            var pos = locToPos(loc,true);
            editor.showMidMenu(e.clientX,e.clientY);
            return false;
        }
        if (!selectBox.isSelected()) {
            var loc = eToLoc(e);
            var pos = locToPos(loc,true);
            editor_mode.onmode('nextChange');
            editor_mode.onmode('loc');
            //editor_mode.loc();
            //tip.whichShow(1);
            tip.showHelp(6);
            startPos = pos;
            uc.strokeStyle = '#FF0000';
            uc.lineWidth = 3;
            if(editor.isMobile)editor.showMidMenu(e.clientX,e.clientY);
            return false;
        }

        holdingPath = 1;
        mouseOutCheck = 2;
        setTimeout(clear1);
        uc.clearRect(0, 0, core.__PIXELS__, core.__PIXELS__);
        var loc = eToLoc(e);
        var pos = locToPos(loc,true);
        stepPostfix = [];
        stepPostfix.push(pos);
        fillPos(pos);
        return false;
    }

    eui.onmousemove = function (e) {
        if (!selectBox.isSelected()) {
            if (startPos == null) return;
            //tip.whichShow(1);
            var loc = eToLoc(e);
            var pos = locToPos(loc,true);
            if (endPos != null && endPos.x == pos.x && endPos.y == pos.y) return;
            if (endPos != null) {
                uc.clearRect(Math.min(32 * startPos.x - core.bigmap.offsetX, 32 * endPos.x - core.bigmap.offsetX),
                    Math.min(32 * startPos.y - core.bigmap.offsetY, 32 * endPos.y - core.bigmap.offsetY),
                    (Math.abs(startPos.x - endPos.x) + 1) * 32, (Math.abs(startPos.y - endPos.y) + 1) * 32)
            }
            endPos = pos;
            if (startPos != null) {
                if (startPos.x != endPos.x || startPos.y != endPos.y) {
                    core.drawArrow('eui',
                        32 * startPos.x + 16 - core.bigmap.offsetX, 32 * startPos.y + 16 - core.bigmap.offsetY,
                        32 * endPos.x + 16 - core.bigmap.offsetX, 32 * endPos.y + 16 - core.bigmap.offsetY);
                }
            }
            // editor_mode.onmode('nextChange');
            // editor_mode.onmode('loc');
            //editor_mode.loc();
            //tip.whichShow(1);
            // tip.showHelp(6);
            return false;
        }

        if (holdingPath == 0) {
            return false;
        }
        mouseOutCheck = 2;
        var loc = eToLoc(e);
        var pos = locToPos(loc,true);
        var pos0 = stepPostfix[stepPostfix.length - 1]
        var directionDistance = [pos.y - pos0.y, pos0.x - pos.x, pos0.y - pos.y, pos.x - pos0.x]
        var max = 0, index = 4;
        for (var i = 0; i < 4; i++) {
            if (directionDistance[i] > max) {
                index = i;
                max = directionDistance[i];
            }
        }
        var pos = [{'x': 0, 'y': 1}, {'x': -1, 'y': 0}, {'x': 0, 'y': -1}, {'x': 1, 'y': 0}, false][index]
        if (pos) {
            pos.x += pos0.x;
            pos.y += pos0.y;
            stepPostfix.push(pos);
            fillPos(pos);
        }
        return false;
    }

    eui.onmouseup = function (e) {
        if (!selectBox.isSelected()) {
            //tip.whichShow(1);
            // editor.movePos(startPos, endPos);
            editor.exchangePos(startPos, endPos);
            startPos = endPos = null;
            uc.clearRect(0, 0, core.__PIXELS__, core.__PIXELS__);
            return false;
        }
        holdingPath = 0;
        if (stepPostfix && stepPostfix.length) {
            editor.preMapData = JSON.parse(JSON.stringify({map:editor.map,fgmap:editor.fgmap,bgmap:editor.bgmap}));
            if(editor.brushMod!=='line'){
                var x0=stepPostfix[0].x;
                var y0=stepPostfix[0].y;
                var x1=stepPostfix[stepPostfix.length-1].x;
                var y1=stepPostfix[stepPostfix.length-1].y;
                if(x0>x1){x0^=x1;x1^=x0;x0^=x1;}//swap
                if(y0>y1){y0^=y1;y1^=y0;y0^=y1;}//swap
                stepPostfix=[];
                for(var jj=y0;jj<=y1;jj++){
                    for(var ii=x0;ii<=x1;ii++){
                        stepPostfix.push({x:ii,y:jj})
                    }
                }
            }
            currDrawData.pos = JSON.parse(JSON.stringify(stepPostfix));
            currDrawData.info = JSON.parse(JSON.stringify(editor.info));
            reDo = null;
            // console.log(stepPostfix);
            if(editor.brushMod==='tileset' && core.tilesets.indexOf(editor.info.images)!==-1){
                var imgWidth=~~(core.material.images.tilesets[editor.info.images].width/32);
                var x0=stepPostfix[0].x;
                var y0=stepPostfix[0].y;
                var idnum=editor.info.idnum;
                for (var ii = 0; ii < stepPostfix.length; ii++){
                    if(stepPostfix[ii].y!=y0){
                        y0++;
                        idnum+=imgWidth;
                    }
                    editor[editor.layerMod][stepPostfix[ii].y][stepPostfix[ii].x] = editor.ids[editor.indexs[idnum+stepPostfix[ii].x-x0]];
                }
            } else {
                for (var ii = 0; ii < stepPostfix.length; ii++)
                editor[editor.layerMod][stepPostfix[ii].y][stepPostfix[ii].x] = editor.info;
            }
            // console.log(editor.map);
            editor.updateMap();
            holdingPath = 0;
            stepPostfix = [];
            uc.clearRect(0, 0, core.__PIXELS__, core.__PIXELS__);
        }
        return false;
    }

    /*
    document.getElementById('mid').onkeydown = function (e) {
        console.log(e);
        if (e.keyCode==37) {
            editor.moveViewport(-1, 0);
        }
        if (e.keyCode==38) {
            editor.moveViewport(0, -1);
        }
        if (e.keyCode==39) {
            editor.moveViewport(1, 0);
        }
        if (e.keyCode==40) {
            editor.moveViewport(0, 1);
        }
    }
    */

    document.getElementById('mid').onmousewheel = function (e) {
        var wheel = function (direct) {
            var index=editor.core.floorIds.indexOf(editor.currentFloorId);
            var toId = editor.currentFloorId;

            if (direct>0 && index<editor.core.floorIds.length-1)
                toId = editor.core.floorIds[index+1];
            else if (direct<0 && index>0)
                toId = editor.core.floorIds[index-1];
            else return;

            editor_mode.onmode('nextChange');
            editor_mode.onmode('floor');
            document.getElementById('selectFloor').value = toId;
            editor.changeFloor(toId);
        }

        try {
            if (e.wheelDelta)
                wheel(Math.sign(e.wheelDelta))
            else if (e.detail)
                wheel(Math.sign(e.detail));
        }
        catch (ee) {
            console.log(ee);
        }
        return false;
    }

    editor.preMapData = null;
    var currDrawData = {
        pos: [],
        info: {}
    };
    var reDo = null;
    var shortcut = core.getLocalStorage('shortcut',{48: 0, 49: 0, 50: 0, 51: 0, 52: 0, 53: 0, 54: 0, 55: 0, 56: 0, 57: 0});
    var copyedInfo = null;
    document.body.onkeydown = function (e) {

        // UI预览 & 地图选点
        if (uievent && uievent.isOpen) {
            e.preventDefault();
            if (e.keyCode == 27) uievent.close();
            else if (e.keyCode == 13) uievent.confirm();
            else if (e.keyCode==87) uievent.move(0,-1)
            else if (e.keyCode==65) uievent.move(-1,0)
            else if (e.keyCode==83) uievent.move(0,1);
            else if (e.keyCode==68) uievent.move(1,0);
            return;
        }

        // 监听Ctrl+S保存
        if (e.ctrlKey && e.keyCode == 83) {
            e.preventDefault();
            if (editor_multi.id != "") {
                editor_multi.confirm(); // 保存脚本编辑器
            }
            else if (editor_blockly.id != "") {
                editor_blockly.confirm(); // 保存事件编辑器
            }
            else {
                editor_mode.saveFloor();
            }
            return;
        }

        // 如果是开启事件/脚本编辑器状态，则忽略
        if (editor_multi.id!="" || editor_blockly.id!="")
            return;

        // 禁止快捷键的默认行为
        if (e.ctrlKey && [89, 90, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(e.keyCode) !== -1)
            e.preventDefault();
        if (e.altKey && [48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(e.keyCode) !== -1)
            e.preventDefault();
        //Ctrl+z 撤销上一步undo
        if (e.keyCode == 90 && e.ctrlKey && editor.preMapData && currDrawData.pos.length && selectBox.isSelected()) {
            editor.map = JSON.parse(JSON.stringify(editor.preMapData.map));
            editor.fgmap = JSON.parse(JSON.stringify(editor.preMapData.fgmap));
            editor.bgmap = JSON.parse(JSON.stringify(editor.preMapData.bgmap));
            editor.updateMap();
            reDo = JSON.parse(JSON.stringify(currDrawData));
            currDrawData = {pos: [], info: {}};
            editor.preMapData = null;
        }
        //Ctrl+y 重做一步redo
        if (e.keyCode == 89 && e.ctrlKey && reDo && reDo.pos.length && selectBox.isSelected()) {
            editor.preMapData = JSON.parse(JSON.stringify({map:editor.map,fgmap:editor.fgmap,bgmap:editor.bgmap}));
            for (var j = 0; j < reDo.pos.length; j++)
                editor.map[reDo.pos[j].y][reDo.pos[j].x] = JSON.parse(JSON.stringify(reDo.info));

            editor.updateMap();
            currDrawData = JSON.parse(JSON.stringify(reDo));
            reDo = null;
        }

        // PGUP和PGDOWN切换楼层
        if (e.keyCode==33 || e.keyCode==34) {
            e.preventDefault();
            var index=editor.core.floorIds.indexOf(editor.currentFloorId);
            var nextIndex = index + (e.keyCode==33?1:-1);
            if (nextIndex>=0 && nextIndex<editor.core.floorIds.length) {
                var toId = editor.core.floorIds[nextIndex];
                editor_mode.onmode('nextChange');
                editor_mode.onmode('floor');
                document.getElementById('selectFloor').value = toId;
                editor.changeFloor(toId);
            }
            return;
        }
        //ctrl + 0~9 切换到快捷图块
        if (e.ctrlKey && [48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(e.keyCode) !== -1){
            editor.setSelectBoxFromInfo(JSON.parse(JSON.stringify(shortcut[e.keyCode]||0)));
            return;
        }
        //alt + 0~9 改变快捷图块
        if (e.altKey && [48, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(e.keyCode) !== -1){
            var infoToSave = JSON.stringify(editor.info||0);
            if(infoToSave==JSON.stringify({}))return;
            shortcut[e.keyCode]=JSON.parse(infoToSave);
            printf('已保存该快捷图块, ctrl + '+(e.keyCode-48)+' 使用.')
            core.setLocalStorage('shortcut',shortcut);
            return;
        }
        var focusElement = document.activeElement;
        if (!focusElement || focusElement.tagName.toLowerCase()=='body') {
            // Ctrl+C, Ctrl+X, Ctrl+V
            if (e.ctrlKey && e.keyCode == 67 && !selectBox.isSelected()) {
                e.preventDefault();
                copyedInfo = editor.copyFromPos();
                printf('该点事件已复制');
                return;
            }
            if (e.ctrlKey && e.keyCode == 88 && !selectBox.isSelected()) {
                e.preventDefault();
                copyedInfo = editor.copyFromPos();
                editor.clearPos(true, null, function () {
                    printf('该点事件已剪切');
                })
                return;
            }
            if (e.ctrlKey && e.keyCode == 86 && !selectBox.isSelected()) {
                e.preventDefault();
                if (!copyedInfo) {
                    printe("没有复制的事件");
                    return;
                }
                editor.pasteToPos(copyedInfo);
                editor.updateMap();
                editor.file.saveFloorFile(function (err) {
                    if (err) {
                        printe(err);
                        throw(err)
                    }
                    ;printf('粘贴事件成功');
                    editor.drawPosSelection();
                });
                return;
            }
            // DELETE
            if (e.keyCode == 46 && !selectBox.isSelected()) {
                editor.clearPos(true);
                return;
            }
            // ESC
            if (e.keyCode == 27) {
                if (selectBox.isSelected()) {
                    editor_mode.onmode('');
                    editor.file.saveFloorFile(function (err) {
                        if (err) {
                            printe(err);
                            throw(err)
                        }
                        ;printf('地图保存成功');
                    });
                }
                selectBox.isSelected(false);
                editor.info = {};
                return;
            }
            switch (e.keyCode) {
                // WASD
                case 87: editor.moveViewport(0,-1); break;
                case 65: editor.moveViewport(-1,0); break;
                case 83: editor.moveViewport(0,1); break;
                case 68: editor.moveViewport(1,0); break;
                // Z~.
                case 90: editor_mode.change('map'); break; // Z
                case 88: editor_mode.change('loc'); break; // X
                case 67: editor_mode.change('enemyitem'); break; // C
                case 86: editor_mode.change('floor'); break; // V
                case 66: editor_mode.change('tower'); break; // B
                case 78: editor_mode.change('functions'); break; // N
                case 77: editor_mode.change('appendpic'); break; // M
                case 188: editor_mode.change('commonevent'); break; // ,
                case 190: editor_mode.change('plugins'); break; // .
                // H
                case 72: editor.showHelp(); break;
            }
            return;
        }
    }

    editor.showHelp = function () {
        alert(
            "快捷操作帮助：\n" +
            "ESC / 点击空白处：自动保存当前修改" +
            "WASD / 长按箭头：平移大地图\n" +
            "PgUp, PgDn / 鼠标滚轮：上下切换楼层\n" +
            "Z~.（键盘的第三排）：快捷切换标签\n" +
            "双击地图：选中对应点的素材\n" +
            "右键地图：弹出菜单栏\n" +
            "Alt+0~9：保存当前使用的图块\n" +
            "Ctrl+0~9：选中保存的图块\n" +
            "Ctrl+Z / Ctrl+Y：撤销/重做上次绘制\n" +
            "Ctrl+S：事件与脚本编辑器的保存并退出\n" +
            "双击事件编辑器：长文本编辑/脚本编辑/地图选点/UI绘制预览"
        );
    }

    var getScrollBarHeight = function () {
        var outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

        document.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = "scroll";

        // add innerdiv
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);

        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    }
    var scrollBarHeight = getScrollBarHeight();

    var iconExpandBtn = document.getElementById('iconExpandBtn');
    iconExpandBtn.style.display = 'block';
    iconExpandBtn.innerText = editor.folded ? "展开" : "折叠";
    iconExpandBtn.onclick = function () {
        if (confirm(editor.folded ? "你想要展开素材吗？\n展开模式下将显示全素材内容。"
            : ("你想要折叠素材吗？\n折叠模式下每个素材将仅显示单列，并且每"+editor.foldPerCol+"个自动换列。"))) {
            core.setLocalStorage('folded', !editor.folded);
            window.location.reload();
        }
    }

    var dataSelection = document.getElementById('dataSelection');
    var iconLib=document.getElementById('iconLib');
    iconLib.onmousedown = function (e) {
        e.stopPropagation();
        if (!editor.isMobile && e.clientY>=iconLib.offsetHeight - scrollBarHeight) return;
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var loc = {
            'x': scrollLeft + e.clientX + iconLib.scrollLeft - right.offsetLeft - iconLib.offsetLeft,
            'y': scrollTop + e.clientY + iconLib.scrollTop - right.offsetTop - iconLib.offsetTop,
            'size': 32
        };
        editor.loc = loc;
        var pos = locToPos(loc);
        for (var spriter in editor.widthsX) {
            if (pos.x >= editor.widthsX[spriter][1] && pos.x < editor.widthsX[spriter][2]) {
                var ysize = spriter.endsWith('48') ? 48 : 32;
                loc.ysize = ysize;
                pos.images = editor.widthsX[spriter][0];
                pos.y = ~~(loc.y / loc.ysize);
                if(!editor.folded && core.tilesets.indexOf(pos.images)==-1) pos.x = editor.widthsX[spriter][1];
                var autotiles = core.material.images['autotile'];
                if (pos.images == 'autotile') {
                    var imNames = Object.keys(autotiles);
                    if ((pos.y + 1) * ysize > editor.widthsX[spriter][3])
                        pos.y = ~~(editor.widthsX[spriter][3] / ysize) - 4;
                    else {
                        for (var i = 0; i < imNames.length; i++) {
                            if (pos.y >= 4 * i && pos.y < 4 * (i + 1)) {
                                pos.images = imNames[i];
                                pos.y = 4 * i;
                            }
                        }
                    }
                }
                else {
                    var height = editor.widthsX[spriter][3], col = height / ysize;
                    if (editor.folded && core.tilesets.indexOf(pos.images)==-1) {
                        col = (pos.x == editor.widthsX[spriter][2] - 1) ? ((col - 1) % editor.foldPerCol + 1) : editor.foldPerCol;
                    }
                    if (spriter == 'terrains' && pos.x == editor.widthsX[spriter][1]) col += 2;
                    pos.y = Math.min(pos.y, col - 1);
                }

                selectBox.isSelected(true);
                // console.log(pos,core.material.images[pos.images].height)
                dataSelection.style.left = pos.x * 32 + 'px';
                dataSelection.style.top = pos.y * ysize + 'px';
                dataSelection.style.height = ysize - 6 + 'px';

                if (pos.x == 0 && pos.y == 0) {
                    // editor.info={idnum:0, id:'empty','images':'清除块', 'y':0};
                    editor.info = 0;
                } else if(pos.x == 0 && pos.y == 1){
                    editor.info = editor.ids[editor.indexs[17]];
                } else {
                    if (autotiles[pos.images]) editor.info = {'images': pos.images, 'y': 0};
                    else if (core.tilesets.indexOf(pos.images)!=-1) editor.info = {'images': pos.images, 'y': pos.y, 'x': pos.x-editor.widthsX[spriter][1]};
                    else {
                        var y = pos.y;
                        if (editor.folded) {
                            y += editor.foldPerCol * (pos.x-editor.widthsX[spriter][1]);
                        }
                        if (pos.images == 'terrains' && pos.x == 0) y -= 2;
                        editor.info = {'images': pos.images, 'y': y}
                    }

                    for (var ii = 0; ii < editor.ids.length; ii++) {
                        if ((core.tilesets.indexOf(pos.images)!=-1 && editor.info.images == editor.ids[ii].images
                                && editor.info.y == editor.ids[ii].y && editor.info.x == editor.ids[ii].x)
                            || (Object.prototype.hasOwnProperty.call(autotiles, pos.images) && editor.info.images == editor.ids[ii].id
                            && editor.info.y == editor.ids[ii].y)
                            || (core.tilesets.indexOf(pos.images)==-1 && editor.info.images == editor.ids[ii].images
                                && editor.info.y == editor.ids[ii].y )
                            ) {

                            editor.info = editor.ids[ii];
                            break;
                        }
                    }
                }
                tip.infos(JSON.parse(JSON.stringify(editor.info)));
                editor_mode.onmode('nextChange');
                editor_mode.onmode('enemyitem');
                //editor_mode.enemyitem();
            }
        }
    }

    var midMenu=document.getElementById('midMenu');
    midMenu.oncontextmenu=function(e){e.preventDefault()}
    editor.lastRightButtonPos=[{x:0,y:0},{x:0,y:0}];
    editor.lastCopyedInfo = [null, null];
    editor.showMidMenu=function(x,y){
        editor.lastRightButtonPos=JSON.parse(JSON.stringify(
            [editor.pos,editor.lastRightButtonPos[0]]
        ));
        // --- copy
        editor.lastCopyedInfo = [editor.copyFromPos(), editor.lastCopyedInfo[0]];
        var locStr='('+editor.lastRightButtonPos[1].x+','+editor.lastRightButtonPos[1].y+')';
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        // 检测是否是上下楼
        var thisevent = editor.map[editor.pos.y][editor.pos.x];
        if (thisevent.id=='upFloor') {
            addFloorEvent.style.display='block';
            addFloorEvent.children[0].innerHTML='绑定上楼事件';
        }
        else if (thisevent.id=='downFloor') {
            addFloorEvent.style.display='block';
            addFloorEvent.children[0].innerHTML='绑定下楼事件';
        }
        else if (['leftPortal','rightPortal','downPortal','upPortal'].indexOf(thisevent.id)>=0) {
            addFloorEvent.style.display='block';
            addFloorEvent.children[0].innerHTML='绑定楼传事件';
        }
        else addFloorEvent.style.display='none';

        chooseThis.children[0].innerHTML='选中此点'+'('+editor.pos.x+','+editor.pos.y+')'
        copyLoc.children[0].innerHTML='复制事件'+locStr+'到此处';
        moveLoc.children[0].innerHTML='交换事件'+locStr+'与此事件的位置';
        midMenu.style='top:'+(y+scrollTop)+'px;left:'+(x+scrollLeft)+'px;';
    }
    editor.hideMidMenu=function(){
        if(editor.isMobile){
            setTimeout(function(){
                midMenu.style='display:none';
            },200)
        } else {
            midMenu.style='display:none';
        }
    }

    var addFloorEvent = document.getElementById('addFloorEvent');
    addFloorEvent.onmousedown = function(e) {
        editor.hideMidMenu();
        e.stopPropagation();
        var thisevent = editor.map[editor.pos.y][editor.pos.x];
        var loc = editor.pos.x+","+editor.pos.y;
        if (thisevent.id=='upFloor') {
            editor.currentFloorData.changeFloor[loc] = {"floorId": ":next", "stair": "downFloor"};
        }
        else if (thisevent.id=='downFloor') {
            editor.currentFloorData.changeFloor[loc] = {"floorId": ":before", "stair": "upFloor"};
        }
        else if (thisevent.id=='leftPortal' || thisevent.id=='rightPortal') {
            editor.currentFloorData.changeFloor[loc] = {"floorId": ":next", "stair": ":symmetry_x"}
        }
        else if (thisevent.id=='upPortal' || thisevent.id=='downPortal') {
            editor.currentFloorData.changeFloor[loc] = {"floorId": ":next", "stair": ":symmetry_y"}
        }
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw(err)
            }
            editor.drawPosSelection();
            editor_mode.showMode('loc');
            printf('添加楼梯事件成功');
        });
    }

    var chooseThis = document.getElementById('chooseThis');
    chooseThis.onmousedown = function(e){
        editor.hideMidMenu();
        e.stopPropagation();
        selectBox.isSelected(false);

        editor_mode.onmode('nextChange');
        editor_mode.onmode('loc');
        //editor_mode.loc();
        //tip.whichShow(1);
        if(editor.isMobile)editor.showdataarea(false);
    }

    var chooseInRight = document.getElementById('chooseInRight');
    chooseInRight.onmousedown = function(e){
        editor.hideMidMenu();
        e.stopPropagation();
        var thisevent = editor[editor.layerMod][editor.pos.y][editor.pos.x];
        editor.setSelectBoxFromInfo(thisevent);
    }

    var copyLoc = document.getElementById('copyLoc');
    copyLoc.onmousedown = function(e){
        editor.hideMidMenu();
        e.stopPropagation();
        editor.preMapData = null;
        reDo = null;
        editor_mode.onmode('');
        var now = editor.pos, last = editor.lastRightButtonPos[1];
        if (now.x == last.x && now.y == last.y) return;
        editor.pasteToPos(editor.lastCopyedInfo[1]);
        editor.updateMap();
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw(err)
            }
            ;printf('复制事件成功');
            editor.drawPosSelection();
        });
    }

    var moveLoc = document.getElementById('moveLoc');
    moveLoc.onmousedown = function(e){
        editor.hideMidMenu();
        e.stopPropagation();
        editor.preMapData = null;
        reDo = null;
        editor_mode.onmode('');
        editor.exchangePos(editor.pos, editor.lastRightButtonPos[1]);
    }

    var clearEvent = document.getElementById('clearEvent');
    clearEvent.onmousedown = function (e) {
        e.stopPropagation();
        reDo = null;
        editor.clearPos(false);
    }

    var clearLoc = document.getElementById('clearLoc');
    clearLoc.onmousedown = function(e){
        e.stopPropagation();
        reDo = null;
        editor.clearPos(true);
    }

    var brushMod=document.getElementById('brushMod');
    brushMod.onchange=function(){
        editor.brushMod=brushMod.value;
    }

    var brushMod2=document.getElementById('brushMod2');
    if(brushMod2)brushMod2.onchange=function(){
        editor.brushMod=brushMod2.value;
    }

    var brushMod3=document.getElementById('brushMod3');
    if(brushMod3) {
        brushMod3.onchange=function(){
            tip.showHelp(5)
            editor.brushMod=brushMod3.value;
        }
    }

    var bgc = document.getElementById('bg'), fgc = document.getElementById('fg'),
        evc = document.getElementById('event'), ev2c = document.getElementById('event2');

    var layerMod=document.getElementById('layerMod');
    layerMod.onchange=function(){
        editor.layerMod=layerMod.value;
        [bgc,fgc,evc,ev2c].forEach(function (x) {
            x.style.opacity = 1;
        });

        // 手机端....
        if (editor.isMobile) {
            if (layerMod.value == 'bgmap') {
                [fgc,evc,ev2c].forEach(function (x) {
                    x.style.opacity = 0.3;
                });
            }
            if (layerMod.value == 'fgmap') {
                [bgc,evc,ev2c].forEach(function (x) {
                    x.style.opacity = 0.3;
                });
            }
        }
    }

    var layerMod2=document.getElementById('layerMod2');
    if(layerMod2)layerMod2.onchange=function(){
        editor.layerMod=layerMod2.value;
        [fgc,evc,ev2c].forEach(function (x) {
            x.style.opacity = 0.3;
        });
        bgc.style.opacity = 1;
    }

    var layerMod3=document.getElementById('layerMod3');
    if(layerMod3)layerMod3.onchange=function(){
        editor.layerMod=layerMod3.value;
        [bgc,evc,ev2c].forEach(function (x) {
            x.style.opacity = 0.3;
        });
        fgc.style.opacity = 1;
    }

    var viewportButtons=document.getElementById('viewportButtons');
    var pressTimer = null;
    for(var ii=0,node;node=viewportButtons.children[ii];ii++){
        (function(x,y){
            var move = function () {
                editor.moveViewport(x, y);
            }
            node.onmousedown = function () {
                clearTimeout(pressTimer);
                pressTimer = setTimeout(function () {
                    pressTimer = -1;
                    var f = function () {
                        if (pressTimer != null) {
                            move();
                            setTimeout(f, 150);
                        }
                    }
                    f();
                }, 500);
            };
            node.onmouseup = function () {
                if (pressTimer > 0) {
                    clearTimeout(pressTimer);
                    move();
                }
                pressTimer = null;
            }
        })([-1,0,0,1][ii],[0,-1,1,0][ii]);
    }
}

editor.constructor.prototype.mobile_listen=function () {
    if(!editor.isMobile)return;

    var mobileview=document.getElementById('mobileview');
    var editModeSelect=document.getElementById('editModeSelect');
    var mid=document.getElementById('mid');
    var right=document.getElementById('right');
    var mobileeditdata=document.getElementById('mobileeditdata');

    
    editor.showdataarea=function(callShowMode){
        mid.style='z-index:-1;opacity: 0;';
        right.style='z-index:-1;opacity: 0;';
        mobileeditdata.style='';
        if(callShowMode)editor.mode.showMode(editModeSelect.value);
        editor.hideMidMenu();
    }
    mobileview.children[0].onclick=function(){
        editor.showdataarea(true)
    }
    mobileview.children[1].onclick=function(){
        mid.style='';
        right.style='z-index:-1;opacity: 0;';
        mobileeditdata.style='z-index:-1;opacity: 0;';
        editor.lastClickId='';
    }
    mobileview.children[3].onclick=function(){
        mid.style='z-index:-1;opacity: 0;';
        right.style='';
        mobileeditdata.style='z-index:-1;opacity: 0;';
        editor.lastClickId='';
    }


    var gettrbyid=function(){
        if(!editor.lastClickId)return false;
        thisTr = document.getElementById(editor.lastClickId);
        input = thisTr.children[2].children[0].children[0];
        field = thisTr.children[0].getAttribute('title');
        cobj = JSON.parse(thisTr.children[1].getAttribute('cobj'));
        return [thisTr,input,field,cobj];
    }
    mobileeditdata.children[0].onclick=function(){
        var info = gettrbyid()
        if(!info)return;
        info[1].ondblclick()
    }
    mobileeditdata.children[1].onclick=function(){
        var info = gettrbyid()
        if(!info)return;
        printf(info[2])
    }
    mobileeditdata.children[2].onclick=function(){
        var info = gettrbyid()
        if(!info)return;
        printf(info[0].children[1].getAttribute('title'))
    }

    //=====

    document.body.ontouchstart=document.body.onmousedown;
    document.body.onmousedown=null;


    var eui=document.getElementById('eui');
    eui.ontouchstart=eui.onmousedown
    eui.onmousedown=null
    eui.ontouchmove=eui.onmousemove
    eui.onmousemove=null
    eui.ontouchend=eui.onmouseup
    eui.onmouseup=null


    var chooseThis = document.getElementById('chooseThis');
    chooseThis.ontouchstart=chooseThis.onmousedown
    chooseThis.onmousedown=null
    var chooseInRight = document.getElementById('chooseInRight');
    chooseInRight.ontouchstart=chooseInRight.onmousedown
    chooseInRight.onmousedown=null
    var copyLoc = document.getElementById('copyLoc');
    copyLoc.ontouchstart=copyLoc.onmousedown
    copyLoc.onmousedown=null
    var moveLoc = document.getElementById('moveLoc');
    moveLoc.ontouchstart=moveLoc.onmousedown
    moveLoc.onmousedown=null
    var clearLoc = document.getElementById('clearLoc');
    clearLoc.ontouchstart=clearLoc.onmousedown
    clearLoc.onmousedown=null
}

}