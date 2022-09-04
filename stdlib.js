
const und = undefined;


const tps = 64
//sdk uses frametime but this is a cm func so it can be constant
const frametime_fixed = 1/tps

//UI WRAPPERS
const SLIDERINT =     0;
const SLIDERFLOAT =   1;
const DROPDOWN =      2;
const MULTIDROPDOWN = 3;
const CHECKBOX =      4;
const TEXTBOX =       5;
const COLORPICKER =   6;
const HOTKEY =        7;

function UIElement(path, name, type, val1, val2)
{

    this.path = path;
    this.name = name;
    this.fullpath = this.path.concat(this.name)
    this.type = type;
    this.val1 = val1;
    this.val2 = val2;

    this.Get = function()
    {
        return UI.GetValue(this.fullpath);
    }
    this.Set = function(n)
    {
        UI.SetValue(this.fullpath, n);
    }
    this.Hide = function()
    {
        UI.SetEnabled(this.fullpath, 0);
    }
    this.Show = function()
    {
        UI.SetEnabled(this.fullpath, 1);
    }
    this.Delete = function()
    {
        UI.RemoveItem(this.fullpath);
    }

    switch(this.type)
    {
        case SLIDERINT:
            UI.AddSliderInt(this.path, this.name, this.val1, this.val2);
            break;
        case SLIDERFLOAT:
            UI.AddSliderFloat(this.path, this.name, this.val1, this.val2);
            break;
        case DROPDOWN:
            if(this.val2 == undefined)
            {
                this.val2 = 0;
            }
            UI.AddDropdown(this.path, this.name, this.val1, this.val2);
            break;

        case MULTIDROPDOWN:
            
            UI.AddMultiDropdown(this.path, this.name, this.val1)
            this.GetAtIndex = function(i)
            {
                var mask = 1 << i;
                return UI.GetValue(this.fullpath) & mask ? true : false;
            }
            this.SetAtIndex = function(i)
            {
                UI.SetValue(this.fullpath, UI.GetValue(this.fullpath) | (1 << i));
            }
            break;
        case CHECKBOX:
            UI.AddCheckbox(this.path, this.name);
            break;

        case TEXTBOX:
            UI.AddTextbox(this.path, this.name);
            this.Get = function()
            {
                return UI.GetString(this.fullpath);
            }
            break;
            
        case COLORPICKER:

            UI.AddColorPicker(this.path, this.name);

            this.Get = function()
            {
                return UI.GetColor(this.fullpath);
            }
            this.Set = function(n)
            {
                UI.SetColor(this.fullpath, n);
            }
            break;
        case HOTKEY:
            UI.AddHotkey(this.path, this.name, this.val1);
            this.GetState = function()
            {
                return UI.GetHotkeyState(this.fullpath);
            }
            this.SetState = function(n)
            {
                UI.SetHotkeyState(this.fullpath, n);
            }

            this.Set = function(n)
            {
                this.Get() != n ? UI.ToggleHotkey(this.fullpath) : 0;
            }
            this.Toggle = function()
            {
                UI.ToggleHotkey(this.fullpath)
            }
            break;
    }


}





//Vectors and angles
function Vector(a, x, y, z)
{
    this.x = x;
    this.y = y;
    this.z = z;
    if(a != undefined)
    {
        this.x = a[0];
        this.z = a[1];
        this.y = a[2]; 
    }

    this.GetArr = function()
    {

        return [this.x,this.z,this.y];
    }
    this.Copy = function()
    {
        return new Vector(und, this.x, this.y, this.z);
    }
    this.Length = function()
    {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }
    this.AddFrom = function(v)
    {

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;

    }
    this.SubFrom = function(v)
    {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
    }
    this.Scale = function(n)
    {
        this.x = this.x * n;
        this.y = this.y * n;
        this.z = this.z * n;
    }
    this.GetScaled = function(n)
    {
        var v = this.Copy()
        v.Scale(n)
        return v
    }
    this.GetNormalized = function()
    {
        var v = this.Copy()
        v.Normalize(n)
        return v
    }
    this.Normalize = function()
    {
        var length = this.Length();
        if(length > 0)
        {
            this.x = this.x / length;
            this.y = this.y / length;
            this.z = this.z / length;
        }
        
    }
    this.Add = function(v)
    {
        res = new Vector(und, this.x + v.x,this.y + v.y,this.z + v.z);
        return res;
    };
    this.Sub = function(v)
    {
        res = new Vector(
            und,
            this.x - v.x,
            this.y - v.y,
            this.z - v.z)
            return res;
    }

    this.Dot = function(v)
    {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }


}


function Angle(a, yaw, pitch, roll)
{

    this.yaw = yaw;
    this.pitch = pitch;
    this.roll = roll;
    
    if(a != undefined)
    {
        this.pitch = a[0];
        this.yaw = a[1];
        this.roll = a[2];

    }

    this.Copy = function()
    {
        return new Angle(und, this.yaw, this.pitch, this.roll)
    }
        
    
    this.GetArr = function()
    {
        return [this.pitch,this.yaw,this.roll];
    }
    this.ToVec = function()
    {
        var a = this.GetRadians()
        return new Vector(und, Math.cos(a.pitch) * Math.cos(a.yaw),  -Math.sin(a.pitch), Math.cos(a.pitch) * Math.sin(a.yaw));
    }

/*
    returns a forward, right, and up vector from an angle
    dont ask me how its done
    fucking hell dude
*/
    this.ToVectors = function()
    {
        var sy, sp, sr, cy, cp, cr

        sy = Math.sin(this.yaw)
        sp = Math.sin(this.pitch)
        sr = Math.sin(this.roll)

        cy = Math.cos(this.yaw)
        cp = Math.cos(this.pitch)
        cr = Math.cos(this.roll)

        var forward = new Vector(und, cp * cy, -sp, cp * sy)
        //shit just got real
        var right = new Vector(und, (-1*sr*sp*cy+-1*cr*-sy),    -1*sr*cp,   (-1*sr*sp*sy+-1*cr*cy))
        var up = new Vector(und,    (cr*sp*cy+-sr*-sy),         cr*cp,      (cr*sp*sy+-sr*cy) )
        return [forward, right, up];
    }

    this.GetRadians = function()
    {
        var a = this.Copy()
        a.ToRadians()
        return a
        
    }

    this.ToRadians = function()
    {
        this.yaw = this.yaw * Math.PI / 180.0;
        this.pitch = this.pitch * Math.PI / 180.0;
        this.roll = this.roll * Math.PI / 180.0;
    }
}


Entity.GetPlayerOrigin = function(player)
{
    return new Vector(Entity.GetProp(player, "CBaseEntity", "m_vecOrigin"))
}


Entity.GetLocalOrigin = function()
{
    return GetPlayerOrigin(Entity.GetLocalPlayer())
}

//
Entity.GetVelocity = function(player)
{
    return new Vector( Entity.GetProp( player, "CBasePlayer", "m_vecVelocity[0]" ));


}

Entity.GetLocalVelocity = function()
{
    return Entity.GetVelocity(Entity.GetLocalPlayer());
}

//Call in cm
//Returns the movement vector of the local player
UserCMD.GetMovementVector = function()
{

	var viewAng = new Angle(Local.GetViewAngles());
    var vecs = viewAng.ToVectors()
    var fwd = vecs[0], right = vecs[1], up = vecs[2];
    var movecmd = new Vector(UserCMD.GetMovement())
    fwd.Scale(movecmd.x);
    right.Scale(movecmd.z);
    up.Scale(movecmd.y)

    var moveVec = new Vector([0,0,0])
    moveVec.x = fwd.x + right.x
    moveVec.z = fwd.z + right.z
    //moveVec.y = fwd.y + right.y + up.y
    
    return moveVec
}


UserCMD.MoveToPoint = function(point)
{
    const threshold = 10
    localplayerPos = Entity.GetLocalOrigin();
    var vecToPeek = point.Sub(localplayerPos);
    vecToPeek.y = 0
	var angle = Math.atan2(vecToPeek.z, vecToPeek.x) * (180 / Math.PI);;
	var viewYaw = Local.GetViewAngles()[1] - 180;
	var realAngle = (AdjustAngle(angle - viewYaw) + 90) * (Math.PI / 180);
	var distance = vecToPeek.Length();
    UserCMD.SetMovement([Math.cos(realAngle) * (distance < threshold ? 50 + distance * 5 : 450), Math.sin(realAngle) * (distance < threshold ? 50 + distance * 5 : 450), 0]);
    return distance;
}



//Internal implementation function, try not to use it 
Entity.GetAcceleration = function(movedir, currentVel, wishSpeed, player)
{

    var accel = Convar.GetFloat("sv_accelerate");
    var veer = movedir.Dot(currentVel);
    var friction = Entity.GetProp( player, "CBasePlayer", "m_flFriction" )


    var addspeed = wishSpeed - veer;
    if (addspeed <= 0)
    {
        return new Vector([0,0,0]);
    }

    // Determine amount of accleration.
    //accelspeed = accel * gpGlobals->frametime * wishspeed * player->m_surfaceFriction;

    var accelSpeed = accel * frametime_fixed * wishSpeed * friction;
    // Cap at addspeed
	if (accelSpeed > addspeed)
    {
        accelSpeed = addspeed;
    }

    var accelV = movedir.GetScaled(accelSpeed);
    
    return accelV
    
}


/*
    curVel: current velocity
    moveVec: movement vector(NOT UserCMD.GetMovement() also related to it, see UserCMD.GetMovementVector())
    player: entity index of the player, shouldn't be relevant but adding as an arg anyway
    Returns velocity of next tick
*/
Entity.PredictNextVel = function(curVel, moveVec, player)
{
    var maxSpeed = Entity.GetProp( player, "CBasePlayer", "m_flMaxspeed" )
    //var moveVec = GetMovementVector();

    var moveDir = moveVec.GetNormalized();

    var speed = moveVec.Length()

    //clamping, useless but here for consistency
    //actually nvm its not useless
    if(speed > maxSpeed)
    {
        speed = maxSpeed
    }
    var resV = curVel.Add(Entity.GetAcceleration(moveDir, curVel, speed, player))

    //clamp velocity vec to max speed
    if(resV.Length() > maxSpeed)
    {
        resV.Normalize()
        resV.Scale(maxSpeed)
    }

    return resV;
    
}

//Wrapper for the above function
Entity.PredictNextLocalVel = function()
{
    var lp = Entity.GetLocalPlayer()
    var curVel = Entity.GetLocalVelocity()
    var moveVec = UserCMD.GetMovementVector()

    return Entity.PredictNextVel(curVel, moveVec, lp);
}



//Render utils

//position, radius, color, fill_color: self explanatory
 //degrees: circle span(can be used to make half circles too, but use 360 for full circle)
//start_at: start span at x degrees
Render.Filled3DCircle = function(position, radius, degrees, start_at, color, fill_color) 
{

    var old_x, old_y;

    //clamp degrees between 360 and 0
    degrees = degrees < 361 && degrees || 360; 
    degrees = degrees > -1 && degrees || 0;
    start_at += 1;

    for (rot = start_at; rot < degrees + start_at + 1; rot += start_at * 8) {
        rot_r = rot * (Math.PI / 180);
        line_x = radius * Math.cos(rot_r) + position[0], line_y = radius * Math.sin(rot_r) + position[1];

        var curr = Render.WorldToScreen([line_x, line_y, position[2]]);
        var cur = Render.WorldToScreen([position[0], position[1], position[2]]);

        if (cur[0] != null && curr[0] != null && old_x != null) {
            Render.Polygon([[curr[0], curr[1]], [old_x, old_y], [cur[0], cur[1]]], fill_color)
            Render.Line(curr[0], curr[1], old_x, old_y, color)
        }

        old_x = curr[0], old_y = curr[1];
    }
}

function print(v)
{
    Cheat.Print(v.toString() + "\n")
}