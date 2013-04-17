import ply.lex as lex
from ply.lex import TOKEN
import ply.yacc as yacc
import sys
import re

reserved = {
   '[SCENE]' : 'SCENE',
   '[title]' : 'TITLE',
   '[character]' : 'CHARACTER',
   '[background]' : 'BACKGROUND',
   '[next]' : 'NEXT',
   '[END]' : 'END',
   '->' : 'ARROW'
}

tokens = ['TEXT',
          'WORD'] + list(reserved.values())

def novel_lexer():
    t_ignore = ' \t'
    
    def t_TEXT(t):
        r'\[text\]((?!\[text\])(.|[\n\r]))*\[\/text\]'
        t.value = re.sub(r'\\', r'\\\\', t.value)
        t.value = re.sub('"', '\\"', t.value)
        t.value = t.value.replace('\n', '\\n')
        t.value = (t.value[6:-7]).strip()
        return t

    def t_newline(t):
        r'\n+'
        t.lexer.lineno += len(t.value)
    
    def t_WORD(t):
        r'[^\s]+'
        t.value = re.sub(r'\\', r'\\\\', t.value)
        t.value = re.sub('"', '\\"', t.value)
        t.type = reserved.get(t.value, 'WORD')
        return t

    def t_error(t):
            print "Illegal character '%s'" % t.value[0]
            t.lexer.skip(1)

    return lex.lex()

def novel_parser():

    def p_novel(p):
        '''novel : scenes'''
        p[0] =  '{ "scenes" : {' + p[1] + '}}'
        
    def p_scenes(p):
        '''scenes : scenes scene
                  | scene'''
        if len(p) == 3:
            p[0] = p[1] + ", \n" + p[2]
        else:
            p[0] = p[1]

    def p_scene(p):
        '''scene : SCENE WORD attributes END'''
        p[0] = '"' + p[2] + '"' + ": {" + p[3] + "}"

    def p_attributes(p):
        '''attributes : attributes attribute
                      | attribute'''
        if len(p) == 3:
            p[0] = p[1] + ", \n" + p[2]
        else:
            p[0] = p[1]

    def p_attribute(p):
        '''attribute : title
                     | background
                     | block'''
        p[0] = p[1]

    def p_block(p):
        '''block : texts
                 | links
                 | characters'''
        p[0] = '"' + p[1][0] + '" : [' + p[1][1] + ']'

    def p_title(p):
        '''title : TITLE sparts'''
        p[0] = '"title" : ' + '"' + p[2] + '"'

    def p_background(p):
        '''background : BACKGROUND WORD'''
        p[0] = '"background" : ' + '"' + p[2] + '"'

    def p_texts(p):
        '''texts : texts text
                 | text'''
        if len(p) == 3:
            p[0] = ('text', p[1][1] + ", \n" + p[2])
        else:
            p[0] = ('text', p[1])

    def p_text(p):
        '''text : TEXT'''
        p[0] = '"' + p[1] + '"'
        
    def p_links(p):
        '''links : links link
                 | link'''
        if len(p) == 3:
            p[0] = ('next', p[1][1] + ", \n" + p[2])
        else:
            p[0] = ('next', p[1])

    def p_link(p):
        '''link : NEXT WORD ARROW sparts'''
        p[0] = '{"to" : "' + p[2] + '", "label" : "' + p[4] + '"}'

    def p_characters(p):
        '''characters : characters character
                      | character'''
        if len(p) == 3:
            p[0] = ('characters', p[1][1] + ", \n" + p[2])
        else:
            p[0] = ('characters', p[1])
    
    def p_character(p):
        '''character : CHARACTER WORD ARROW manipulations'''
        p[0] = ('{"character" : "' + p[2] + '", "manipulation" : {'
                + p[4] + '}}')

    def p_manipulations(p):
        '''manipulations : manipulations manipulation
                         | manipulation'''
        if len(p) == 3:
            p[0] = p[1] + ", \n" + p[2]
        else:
            p[0] = p[1]
        
    def p_manipulation(p):
        '''manipulation : WORD'''
        first, last = p[1].split('-')
        if first == 'width' or first == 'height':
            last = last + 'px'
        p[0] = '"'+ first + '" : "' + last + '"'

    def p_sparts(p):
        '''sparts : sparts WORD
                  | WORD'''
        if len(p) == 3:
            p[0] = p[1] + " " + p[2]
        else:
            p[0] = p[1]

    def p_error(p):
        print "Syntax error in input! -> " + str(p)

    return yacc.yacc()

if __name__ == "__main__":
    novel_lexer()
##    lex.runmain()
    
    filename = sys.argv[1]
    f = open(filename, "r")
    indat = f.read()
    f.close()
    
    parser = novel_parser()
    result = parser.parse(indat)

    name, ext = filename.split('.')
    f = open(name + '.json', 'w')
    f.write(result)
    f.close()
