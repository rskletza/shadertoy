#define PI 3.14159265359


float plot (vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) -
          smoothstep( pct, pct+0.01, st.y);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}


float sunrise (float x)
{
	x -= 0.3;
    x = (sin(0.3 * iTime)+ 1.0) * x;
   	float wave = max(0., - pow(10. * x, 5.) + 1.0);
	float dip = min(1.0, pow(20. * x, 2.));
	float y = wave * dip;
    return y;
}

float sundist(vec2 st)
{
    float x = mod(0.2 * iTime, 2.);
    //
//    float y = 5. * sin(x * PI);
    float y = 1.0 - pow(abs(sin(PI * x/2.0)), 3.5);
    // shift the sun so that it moves above and below frame
    y = y*1.5-0.1;
//    float y = 1.0 - pow(abs(sin(2. * PI * (x-0.5)/2.0)), 4.5);
    
    return distance(st, vec2(x,y));
}

vec3 suncolor()
{
    float val = (0.5 * sin(iTime) + 0.5);
    vec3 rgb = mix(vec3(1.0, 0.28, 0.0), vec3(0.0, 0.04, 0.46), val);
    // float h = abs(smoothstep(-0.66, 0.2, val));
    return rgb;
}

vec3 skycolor(vec2 st)
{
    float dist = sundist(st);
    return vec3(0.,0.,0.);
}

float sunball(vec2 st)
{
    float x = sundist(st);
    float y = exp(-pow(10. * x,2.)) + 0.05;
    float g = exp(-pow(x,2.)) * 0.25;
    y += g;
    return y;
}

vec3 blue(float y)
{
    vec3 dark = vec3(0.0, 0.04, 0.46);
    vec3 light = vec3(0.6, 0.9, 1.0);

    y = max(0., min(1., y)); // TODO clamp or clip or something
    return mix(dark, light, y); 
}

vec3 orange(float y)
{
    vec3 orange = vec3(1.0, 0.28, 0.0);
    vec3 yellow = vec3(1.0, 1.0, 0.84);

    y = max(0., min(1., y)); // TODO clamp or clip or something
    return mix(orange, yellow, y); 
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 st = fragCoord/iResolution.xy;

    // create a reflection
    st -= vec2(0.0,0.2);
    st.y = abs(st.y);

    vec3 color = vec3(0.0, 0.0, 0.0);
    //float blue = suncolor().b;
    float sunfactor = sunball(st);
    color = mix(blue(sunfactor), orange(sunfactor), sunfactor);
    /*
    vec3 pct = vec3(st.x);

    pct.r = 0.0;//smoothstep(0.0,1.0, st.x);
    pct.g = 0.0;//sin(st.x*PI);
    pct.b = sunrise(st.x);

    color = mix(colorA, colorB, pct);

    // Plot transition lines for each channel
    color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));
    color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));
    color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));
    */

//    color = hsb2rgb(vec3(st.x, 1.0, st.y));

    // Output to screen
    fragColor = vec4(color, 1.0);
}